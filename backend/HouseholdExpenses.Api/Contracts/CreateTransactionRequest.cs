using HouseholdExpenses.Api.Models;

namespace HouseholdExpenses.Api.Contracts;

/// <summary>
/// Payload de criação de transação.
/// </summary>
public sealed record CreateTransactionRequest(
    string Description,
    decimal Value,
    TransactionType Type,
    Guid PersonId);
