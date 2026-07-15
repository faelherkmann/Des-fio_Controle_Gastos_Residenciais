using HouseholdExpenses.Api.Models;

namespace HouseholdExpenses.Api.Contracts;

/// <summary>
/// Totais financeiros de uma pessoa cadastrada.
/// </summary>
public sealed record PersonTotalsResponse
{
    public Guid PersonId { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal TotalIncome { get; init; }
    public decimal TotalExpense { get; init; }
    public decimal Balance => TotalIncome - TotalExpense;
}

/// <summary>
/// Resposta com o resumo geral e por pessoa.
/// </summary>
public sealed record TotalsResponse
{
    public IReadOnlyList<PersonTotalsResponse> People { get; init; } = Array.Empty<PersonTotalsResponse>();
    public decimal TotalIncome { get; init; }
    public decimal TotalExpense { get; init; }
    public decimal Balance => TotalIncome - TotalExpense;
}
