namespace HouseholdExpenses.Api.Contracts;

/// <summary>
/// Payload de criação de pessoa.
/// </summary>
public sealed record CreatePersonRequest(string Name, int Age);
