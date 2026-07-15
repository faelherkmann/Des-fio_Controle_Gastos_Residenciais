namespace HouseholdExpenses.Api.Models;

/// <summary>
/// Representa uma pessoa cadastrada no sistema.
/// O identificador é gerado automaticamente para simplificar o uso no front-end.
/// </summary>
public sealed record Person
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public int Age { get; init; }
}
