using System.Text.Json;
using HouseholdExpenses.Api.Contracts;
using HouseholdExpenses.Api.Models;

namespace HouseholdExpenses.Api.Services;

/// <summary>
/// Armazena o estado da aplicação em um arquivo JSON local.
/// Essa abordagem atende ao requisito de persistência sem depender de banco externo.
/// </summary>
public sealed class HouseholdStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    private readonly SemaphoreSlim _gate = new(1, 1);
    private readonly string _filePath;

    public HouseholdStore(IWebHostEnvironment environment)
    {
        var dataDirectory = Path.Combine(environment.ContentRootPath, "App_Data");
        Directory.CreateDirectory(dataDirectory);
        _filePath = Path.Combine(dataDirectory, "household-expenses.json");
    }

    public async Task<IReadOnlyList<Person>> GetPeopleAsync()
    {
        return await ReadAsync(state => state.People.OrderBy(person => person.Name).ToList());
    }

    public async Task<IReadOnlyList<Transaction>> GetTransactionsAsync()
    {
        return await ReadAsync(state => state.Transactions.OrderBy(transaction => transaction.Description).ToList());
    }

    public async Task<Person> AddPersonAsync(CreatePersonRequest request)
    {
        ValidatePerson(request);

        return await MutateAsync(state =>
        {
            var person = new Person
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Age = request.Age
            };

            state.People.Add(person);
            return person;
        });
    }

    public async Task<bool> DeletePersonAsync(Guid personId)
    {
        return await MutateAsync(state =>
        {
            var removed = state.People.RemoveAll(person => person.Id == personId) > 0;
            if (!removed)
            {
                return false;
            }

            // Quando a pessoa é excluída, todas as transações relacionadas também precisam sair do armazenamento.
            state.Transactions.RemoveAll(transaction => transaction.PersonId == personId);
            return true;
        });
    }

    public async Task<Transaction> AddTransactionAsync(CreateTransactionRequest request)
    {
        ValidateTransaction(request);

        return await MutateAsync(state =>
        {
            var person = state.People.FirstOrDefault(item => item.Id == request.PersonId);
            if (person is null)
            {
                throw new InvalidOperationException("A pessoa informada não existe no cadastro.");
            }

            if (person.Age < 18 && request.Type == TransactionType.Income)
            {
                throw new InvalidOperationException("Menores de idade podem cadastrar apenas despesas.");
            }

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                Description = request.Description.Trim(),
                Value = request.Value,
                Type = request.Type,
                PersonId = request.PersonId
            };

            state.Transactions.Add(transaction);
            return transaction;
        });
    }

    public async Task<TotalsResponse> GetTotalsAsync()
    {
        return await ReadAsync(state =>
        {
            var totalsByPerson = state.People
                .OrderBy(person => person.Name)
                .Select(person =>
                {
                    var personTransactions = state.Transactions.Where(transaction => transaction.PersonId == person.Id);
                    var totalIncome = personTransactions.Where(transaction => transaction.Type == TransactionType.Income).Sum(transaction => transaction.Value);
                    var totalExpense = personTransactions.Where(transaction => transaction.Type == TransactionType.Expense).Sum(transaction => transaction.Value);

                    return new PersonTotalsResponse
                    {
                        PersonId = person.Id,
                        Name = person.Name,
                        TotalIncome = totalIncome,
                        TotalExpense = totalExpense
                    };
                })
                .ToList();

            return new TotalsResponse
            {
                People = totalsByPerson,
                TotalIncome = totalsByPerson.Sum(item => item.TotalIncome),
                TotalExpense = totalsByPerson.Sum(item => item.TotalExpense)
            };
        });
    }

    private async Task<TResult> ReadAsync<TResult>(Func<HouseholdState, TResult> projector)
    {
        await _gate.WaitAsync();
        try
        {
            var state = await LoadStateAsync();
            return projector(state);
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task<TResult> MutateAsync<TResult>(Func<HouseholdState, TResult> mutation)
    {
        await _gate.WaitAsync();
        try
        {
            var state = await LoadStateAsync();
            var result = mutation(state);
            await SaveStateAsync(state);
            return result;
        }
        finally
        {
            _gate.Release();
        }
    }

    private async Task<HouseholdState> LoadStateAsync()
    {
        if (!File.Exists(_filePath))
        {
            return new HouseholdState();
        }

        await using var stream = File.OpenRead(_filePath);
        var state = await JsonSerializer.DeserializeAsync<HouseholdState>(stream, JsonOptions);
        return state ?? new HouseholdState();
    }

    private async Task SaveStateAsync(HouseholdState state)
    {
        await using var stream = File.Create(_filePath);
        await JsonSerializer.SerializeAsync(stream, state, JsonOptions);
    }

    private static void ValidatePerson(CreatePersonRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new InvalidOperationException("O nome da pessoa é obrigatório.");
        }

        if (request.Age < 0)
        {
            throw new InvalidOperationException("A idade não pode ser negativa.");
        }
    }

    private static void ValidateTransaction(CreateTransactionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Description))
        {
            throw new InvalidOperationException("A descrição da transação é obrigatória.");
        }

        if (request.Value <= 0)
        {
            throw new InvalidOperationException("O valor da transação deve ser maior que zero.");
        }
    }

    private sealed record HouseholdState
    {
        public List<Person> People { get; init; } = [];
        public List<Transaction> Transactions { get; init; } = [];
    }
}
