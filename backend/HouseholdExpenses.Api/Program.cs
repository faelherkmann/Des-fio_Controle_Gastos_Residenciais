using HouseholdExpenses.Api.Contracts;
using HouseholdExpenses.Api.Models;
using HouseholdExpenses.Api.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Serviços do backend: documentação, persistência e CORS para o front-end React.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddSingleton<HouseholdStore>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Frontend");

app.MapGet("/api/people", async (HouseholdStore store) =>
{
    var people = await store.GetPeopleAsync();
    return Results.Ok(people);
});

app.MapPost("/api/people", async (CreatePersonRequest request, HouseholdStore store) =>
{
    try
    {
        var person = await store.AddPersonAsync(request);
        return Results.Created($"/api/people/{person.Id}", person);
    }
    catch (InvalidOperationException exception)
    {
        return Results.BadRequest(new { message = exception.Message });
    }
});

app.MapDelete("/api/people/{id:guid}", async (Guid id, HouseholdStore store) =>
{
    var deleted = await store.DeletePersonAsync(id);
    return deleted ? Results.NoContent() : Results.NotFound(new { message = "Pessoa não encontrada." });
});

app.MapGet("/api/transactions", async (HouseholdStore store) =>
{
    var transactions = await store.GetTransactionsAsync();
    return Results.Ok(transactions);
});

app.MapPost("/api/transactions", async (CreateTransactionRequest request, HouseholdStore store) =>
{
    try
    {
        var transaction = await store.AddTransactionAsync(request);
        return Results.Created($"/api/transactions/{transaction.Id}", transaction);
    }
    catch (InvalidOperationException exception)
    {
        return Results.BadRequest(new { message = exception.Message });
    }
});

app.MapGet("/api/totals", async (HouseholdStore store) =>
{
    var totals = await store.GetTotalsAsync();
    return Results.Ok(totals);
});

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();
