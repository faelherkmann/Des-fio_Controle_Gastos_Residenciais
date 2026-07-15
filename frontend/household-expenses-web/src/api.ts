export type TransactionType = 'Expense' | 'Income';

export type Person = {
  id: string;
  name: string;
  age: number;
};

export type Transaction = {
  id: string;
  description: string;
  value: number;
  type: TransactionType;
  personId: string;
};

export type PersonTotals = {
  personId: string;
  name: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type TotalsResponse = {
  people: PersonTotals[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type ApiError = {
  message: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5014';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(payload?.message ?? 'Falha ao comunicar com a API.');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function listPeople() {
  return requestJson<Person[]>('/api/people');
}

export function createPerson(payload: { name: string; age: number }) {
  return requestJson<Person>('/api/people', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deletePerson(id: string) {
  return requestJson<void>(`/api/people/${id}`, {
    method: 'DELETE',
  });
}

export function listTransactions() {
  return requestJson<Transaction[]>('/api/transactions');
}

export function createTransaction(payload: {
  description: string;
  value: number;
  type: TransactionType;
  personId: string;
}) {
  return requestJson<Transaction>('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getTotals() {
  return requestJson<TotalsResponse>('/api/totals');
}
