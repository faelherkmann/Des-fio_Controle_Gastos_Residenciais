# 💰 Controle de Gastos Residenciais

Sistema completo de controle de gastos residenciais com cadastro de pessoas, registro de transações financeiras e consulta consolidada de totais, desenvolvido com .NET/C# no backend e React/TypeScript no frontend.

---

## 📋 Funcionalidades

### ✅ Cadastro de Pessoas
- Criar nova pessoa (nome, idade)
- Listar todas as pessoas cadastradas
- Deletar pessoa (remove automaticamente todas as transações associadas)
- ID único gerado automaticamente (GUID)

### ✅ Cadastro de Transações
- Registrar nova transação (descrição, valor, tipo, pessoa)
- Listar todas as transações
- Validação: menores de 18 anos podem registrar apenas **despesas**
- ID único gerado automaticamente (GUID)

### ✅ Consulta de Totais
- Visualizar totais consolidados por pessoa (receitas, despesas, saldo)
- Ver total geral de todas as pessoas
- Cálculo automático de saldo (receitas - despesas)

---

## 🏗️ Arquitetura

```
Des-fio_Controle_Gastos_Residenciais/
├── backend/
│   └── HouseholdExpenses.Api/
│       ├── Models/           # Modelos de domínio (Person, Transaction)
│       ├── Contracts/        # Payloads de entrada/saída
│       ├── Services/         # Lógica de persistência (HouseholdStore)
│       ├── Program.cs        # Configuração da API e endpoints
│       └── App_Data/         # Armazenamento local em JSON
│
└── frontend/
    └── household-expenses-web/
        ├── src/
        │   ├── App.tsx       # Componente principal
        │   ├── api.ts        # Cliente HTTP
        │   ├── styles.css    # Estilos
        │   └── main.tsx      # Ponto de entrada
        └── vite.config.ts    # Configuração do Vite
```

---

## 🛠️ Tecnologias

### Backend
- **.NET 8.0** - Framework web
- **C#** - Linguagem
- **ASP.NET Core Minimal APIs** - Endpoints HTTP
- **JSON** - Persistência local

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipagem
- **Vite** - Build tool
- **CSS3** - Styling

---

## 📦 Pré-requisitos

Antes de executar o projeto, instale:

- **.NET SDK 8.0+** → [Download](https://dotnet.microsoft.com/download)
- **Node.js 18+** → [Download](https://nodejs.org)

Verifique as instalações:
```powershell
dotnet --version
node -v
npm -v
```

---

## 🚀 Como Executar

### 1️⃣ Clone o repositório
```powershell
git clone https://github.com/faelherkmann/Des-fio_Controle_Gastos_Residenciais.git
cd Des-fio_Controle_Gastos_Residenciais
```

### 2️⃣ Execute o Backend (Terminal 1)
```powershell
cd backend\HouseholdExpenses.Api
dotnet run
```

Você verá:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5014
```

### 3️⃣ Execute o Frontend (Terminal 2)
```powershell
cd frontend\household-expenses-web
npm install
npm run dev
```

Você verá:
```
➜  Local:   http://localhost:5173/
```

### 4️⃣ Acesse a Aplicação
Abra seu navegador em: **http://localhost:5173**

---

## 📚 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/people` | Lista todas as pessoas |
| `POST` | `/api/people` | Cria uma nova pessoa |
| `DELETE` | `/api/people/{id}` | Deleta uma pessoa |
| `GET` | `/api/transactions` | Lista todas as transações |
| `POST` | `/api/transactions` | Cria uma nova transação |
| `GET` | `/api/totals` | Retorna totais consolidados |

### Documentação Interativa
Acesse o **Swagger UI** em desenvolvimento: `http://localhost:5014/swagger`

---

## 📝 Exemplos de Uso

### Criar Pessoa
```json
POST /api/people
{
  "name": "João Silva",
  "age": 30
}
```

### Criar Transação
```json
POST /api/transactions
{
  "description": "Aluguel",
  "value": 1200.00,
  "type": "Expense",
  "personId": "uuid-aqui"
}
```

### Obter Totais
```json
GET /api/totals

Resposta:
{
  "people": [
    {
      "personId": "uuid",
      "name": "João Silva",
      "totalIncome": 5000.00,
      "totalExpense": 2000.00,
      "balance": 3000.00
    }
  ],
  "totalIncome": 5000.00,
  "totalExpense": 2000.00,
  "balance": 3000.00
}
```

---

## 💾 Persistência

Os dados são salvos em arquivo JSON local:
```
backend/HouseholdExpenses.Api/App_Data/household-expenses.json
```

**Exemplo do arquivo:**
```json
{
  "people": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Maria Santos",
      "age": 25
    }
  ],
  "transactions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "description": "Conta de luz",
      "value": 150.50,
      "type": "Expense",
      "personId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

Os dados **persistem** mesmo após fechar a aplicação.

---

## 🎯 Regras de Negócio

✅ **Identificadores únicos**: Gerados automaticamente (GUID)  
✅ **Validação de pessoa**: Nome obrigatório, idade ≥ 0  
✅ **Menores de idade**: Podem registrar apenas **despesas** (< 18 anos)  
✅ **Validação de transação**: Descrição e valor obrigatórios, pessoa deve existir  
✅ **Cascade delete**: Ao deletar pessoa, suas transações são apagadas  
✅ **Cálculo de saldo**: Saldo = Receitas - Despesas  

---

## 🔐 Segurança & Boas Práticas

- ✅ **CORS** configurado para frontend local
- ✅ **Validação** de entrada em todos os endpoints
- ✅ **Lock de concorrência** para operações simultâneas
- ✅ **Código comentado** com XML documentation
- ✅ **TypeScript** para tipagem estática no frontend
- ✅ **Records imutáveis** em C# para integridade de dados

---

## 📋 Instruções Detalhadas

Consulte o arquivo [**INSTRUÇÕES_EXECUÇÃO.md**](INSTRUÇÕES_EXECUÇÃO.md) para troubleshooting e configurações avançadas.

---

## 👨‍💻 Autor

Desenvolvido como desafio técnico de controle de gastos residenciais.

---

## 📄 Licença

Este projeto é de uso livre para fins educacionais.
