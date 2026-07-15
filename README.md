# Controle de Gastos Residenciais

Aplicação de desafio técnico com backend em .NET/C# e front-end em React/TypeScript.

## Estrutura

- `backend/HouseholdExpenses.Api`: API ASP.NET Core com persistência local em JSON.
- `frontend/household-expenses-web`: interface React para cadastro e consulta.

## Regras implementadas

- Cadastro, listagem e exclusão de pessoas.
- Cadastro e listagem de transações.
- Menores de 18 anos podem cadastrar apenas despesas.
- Exclusão de pessoa remove também todas as transações associadas.
- Consulta de totais por pessoa e total geral.

## Como executar

### Backend

```powershell
cd backend\HouseholdExpenses.Api
dotnet run
```

A API sobe por padrão em `http://localhost:5014` e expõe Swagger em ambiente de desenvolvimento.

### Front-end

```powershell
cd frontend\household-expenses-web
npm install
npm run dev
```

Se a API estiver em outra URL, ajuste `VITE_API_BASE_URL` antes de iniciar o front-end.

## Persistência

Os dados ficam salvos em `backend/HouseholdExpenses.Api/App_Data/household-expenses.json`, então permanecem após fechar a aplicação.
