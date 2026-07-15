import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createPerson,
  createTransaction,
  deletePerson,
  getTotals,
  listPeople,
  listTransactions,
  Person,
  Transaction,
  TransactionType,
  TotalsResponse,
} from './api';

const emptyTotals: TotalsResponse = {
  people: [],
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<TotalsResponse>(emptyTotals);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [personName, setPersonName] = useState('');
  const [personAge, setPersonAge] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionValue, setTransactionValue] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('Expense');
  const [transactionPersonId, setTransactionPersonId] = useState('');
  const [savingPerson, setSavingPerson] = useState(false);
  const [savingTransaction, setSavingTransaction] = useState(false);
  const [removingPersonId, setRemovingPersonId] = useState('');

  const selectedPerson = useMemo(
    () => people.find((person) => person.id === transactionPersonId),
    [people, transactionPersonId],
  );

  const minorRestrictionActive = selectedPerson?.age !== undefined && selectedPerson.age < 18;

  async function refreshAll() {
    setError('');
    setLoading(true);

    try {
      const [peopleData, transactionsData, totalsData] = await Promise.all([
        listPeople(),
        listTransactions(),
        getTotals(),
      ]);

      setPeople(peopleData);
      setTransactions(transactionsData);
      setTotals(totalsData);

      const transactionPersonStillExists = peopleData.some((person) => person.id === transactionPersonId);
      if (peopleData.length > 0 && !transactionPersonStillExists) {
        setTransactionPersonId(peopleData[0].id);
      } else if (peopleData.length === 0) {
        setTransactionPersonId('');
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro inesperado ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshAll();
    // O carregamento inicial consolida pessoas, transações e totais em uma única passagem.
    // Isso evita estados parcialmente atualizados na interface.
  }, []);

  async function handleCreatePerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPerson(true);
    setError('');

    try {
      await createPerson({ name: personName, age: Number(personAge) });
      setPersonName('');
      setPersonAge('');
      await refreshAll();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar pessoa.');
    } finally {
      setSavingPerson(false);
    }
  }

  async function handleDeletePerson(id: string) {
    setRemovingPersonId(id);
    setError('');

    try {
      await deletePerson(id);
      await refreshAll();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Falha ao excluir pessoa.');
    } finally {
      setRemovingPersonId('');
    }
  }

  async function handleCreateTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingTransaction(true);
    setError('');

    try {
      await createTransaction({
        description: transactionDescription,
        value: Number(transactionValue),
        type: transactionType,
        personId: transactionPersonId,
      });
      setTransactionDescription('');
      setTransactionValue('');
      setTransactionType('Expense');
      await refreshAll();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Falha ao cadastrar transação.');
    } finally {
      setSavingTransaction(false);
    }
  }

  return (
    <div className="shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <main className="app-card">
        <header className="hero">
          <div>
            <h1>Controle de gastos residenciais</h1>
            <p className="hero-copy">
              Cadastro de pessoas, registro de transações e consulta consolidada de totais com persistência local.
            </p>
          </div>

          <div className="hero-metrics">
            <article>
              <span>Pessoas</span>
              <strong>{people.length}</strong>
            </article>
            <article>
              <span>Transações</span>
              <strong>{transactions.length}</strong>
            </article>
            <article>
              <span>Saldo líquido</span>
              <strong className={totals.balance >= 0 ? 'positive' : 'negative'}>{currency.format(totals.balance)}</strong>
            </article>
          </div>
        </header>

        {error ? <div className="alert">{error}</div> : null}
        {loading ? <div className="loading">Carregando dados...</div> : null}

        <section className="grid two-columns">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Cadastro de pessoas</p>
                <h2>Gerencie moradores e responsáveis financeiros</h2>
              </div>
            </div>

            <form onSubmit={handleCreatePerson} className="stacked-form">
              <label>
                Nome
                <input value={personName} onChange={(event) => setPersonName(event.target.value)} placeholder="Ex.: Maria Silva" />
              </label>
              <label>
                Idade
                <input
                  type="number"
                  min="0"
                  value={personAge}
                  onChange={(event) => setPersonAge(event.target.value)}
                  placeholder="Ex.: 32"
                />
              </label>
              <button type="submit" disabled={savingPerson}>
                {savingPerson ? 'Salvando...' : 'Cadastrar pessoa'}
              </button>
            </form>

            <div className="list">
              {people.length === 0 ? (
                <p className="empty-state">Nenhuma pessoa cadastrada ainda.</p>
              ) : (
                people.map((person) => (
                  <article className="list-row" key={person.id}>
                    <div>
                      <strong>{person.name}</strong>
                      <p>
                        {person.age} anos • ID {person.id}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="ghost danger"
                      onClick={() => void handleDeletePerson(person.id)}
                      disabled={removingPersonId === person.id}
                    >
                      {removingPersonId === person.id ? 'Excluindo...' : 'Excluir'}
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Cadastro de transações</p>
                <h2>Registre despesas e receitas</h2>
              </div>
            </div>

            <form onSubmit={handleCreateTransaction} className="stacked-form">
              <label>
                Descrição
                <input
                  value={transactionDescription}
                  onChange={(event) => setTransactionDescription(event.target.value)}
                  placeholder="Ex.: Conta de luz"
                />
              </label>
              <label>
                Valor
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={transactionValue}
                  onChange={(event) => setTransactionValue(event.target.value)}
                  placeholder="Ex.: 120.50"
                />
              </label>
              <label>
                Pessoa
                <select value={transactionPersonId} onChange={(event) => setTransactionPersonId(event.target.value)}>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} ({person.age} anos)
                    </option>
                  ))}
                </select>
              </label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={transactionType === 'Expense' ? 'segment active' : 'segment'}
                  onClick={() => setTransactionType('Expense')}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  className={transactionType === 'Income' ? 'segment active' : 'segment'}
                  onClick={() => setTransactionType('Income')}
                  disabled={minorRestrictionActive}
                >
                  Receita
                </button>
              </div>
              {minorRestrictionActive ? (
                <p className="hint">Pessoa menor de 18 anos: apenas despesas podem ser cadastradas.</p>
              ) : null}
              <button type="submit" disabled={savingTransaction || people.length === 0}>
                {savingTransaction ? 'Salvando...' : 'Cadastrar transação'}
              </button>
            </form>
          </section>
        </section>

        <section className="grid two-columns">
          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Transações registradas</p>
                <h2>Histórico consolidado</h2>
              </div>
            </div>

            <div className="list compact">
              {transactions.length === 0 ? (
                <p className="empty-state">Nenhuma transação cadastrada ainda.</p>
              ) : (
                transactions.map((transaction) => {
                  const owner = people.find((person) => person.id === transaction.personId);

                  return (
                    <article className="list-row" key={transaction.id}>
                      <div>
                        <strong>{transaction.description}</strong>
                        <p>
                          {owner?.name ?? 'Pessoa removida'} • {transaction.type === 'Income' ? 'Receita' : 'Despesa'} •{' '}
                          {currency.format(transaction.value)}
                        </p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Consulta de totais</p>
                <h2>Resumo por pessoa e total geral</h2>
              </div>
            </div>

            <div className="summary-cards">
              <article>
                <span>Total de receitas</span>
                <strong>{currency.format(totals.totalIncome)}</strong>
              </article>
              <article>
                <span>Total de despesas</span>
                <strong>{currency.format(totals.totalExpense)}</strong>
              </article>
              <article>
                <span>Saldo líquido</span>
                <strong className={totals.balance >= 0 ? 'positive' : 'negative'}>{currency.format(totals.balance)}</strong>
              </article>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pessoa</th>
                    <th>Receitas</th>
                    <th>Despesas</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {totals.people.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="empty-state">
                        Nenhum total para exibir.
                      </td>
                    </tr>
                  ) : (
                    totals.people.map((personTotals) => (
                      <tr key={personTotals.personId}>
                        <td>{personTotals.name}</td>
                        <td>{currency.format(personTotals.totalIncome)}</td>
                        <td>{currency.format(personTotals.totalExpense)}</td>
                        <td className={personTotals.balance >= 0 ? 'positive' : 'negative'}>
                          {currency.format(personTotals.balance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
