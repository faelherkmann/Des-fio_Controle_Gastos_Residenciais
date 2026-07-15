namespace HouseholdExpenses.Api.Models;

/// <summary>
/// Representa uma transação financeira vinculada a uma pessoa.
/// </summary>
public sealed record Transaction
{
    public Guid Id { get; init; }
    public string Description { get; init; } = string.Empty;
    public decimal Value { get; init; }
    public TransactionType Type { get; init; }
    public Guid PersonId { get; init; }
}
