## Pré-requisitos

Certifique-se de que você tem instalado:
- **.NET SDK 8.0+**: [Download aqui](https://dotnet.microsoft.com/download)
- **Node.js 18+**: [Download aqui](https://nodejs.org)

Para verificar se estão instalados:
```powershell
dotnet --version
node -v
npm -v
```

---

## Passo a Passo para Executar a Aplicação

### Terminal 1: Executar o Backend

Abra um terminal PowerShell na pasta raiz do projeto e execute:

```powershell
cd backend\HouseholdExpenses.Api
dotnet run
```

Você verá uma saída como:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5014
```

**Deixe este terminal aberto** — a API precisa ficar rodando.

---

### Terminal 2: Executar o Front-end

Abra um **novo** terminal PowerShell na pasta raiz do projeto e execute:

```powershell
cd frontend\household-expenses-web
npm install
npm run dev
```

Você verá uma saída como:
```
  ➜  Local:   http://localhost:5173/
```

Copie esse endereço e abra em seu navegador.

---

### Pronto!

A aplicação agora está rodando com:
- **Backend**: `http://localhost:5014` (com Swagger em `/swagger`)
- **Front-end**: `http://localhost:5173/`

No navegador você consegue:
1. Cadastrar pessoas (nome + idade)
2. Deletar pessoas (remove também as transações associadas)
3. Cadastrar transações (descrição, valor, tipo, pessoa)
4. Ver o histórico de transações
5. Consultar totais consolidados por pessoa e total geral

**Regra especial**: Se a pessoa tem menos de 18 anos, o botão de "Receita" fica desabilitado no formulário de transação.

Os dados ficam salvos automaticamente em JSON local (`backend/HouseholdExpenses.Api/App_Data/household-expenses.json`), então permanecem mesmo após fechar a aplicação.

---

### Se algo não funcionar:

1. **Node/npm não encontrado**: Execute `$env:Path = 'C:\Program Files\nodejs;' + $env:Path` antes.
2. **Porta 5014 ocupada**: Abra `backend/HouseholdExpenses.Api/Properties/launchSettings.json` e mude a porta.
3. **Erro de CORS**: Verifique se o front-end está em `http://localhost:5173` conforme a configuração no backend.

---

### Para parar:

- Terminal 1 (Backend): Pressione `Ctrl+C`
- Terminal 2 (Front-end): Pressione `Ctrl+C`
