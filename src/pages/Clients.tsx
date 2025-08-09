import { useCallback, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';

interface Client {
  id: number;
  name: string;
}

export default function Clients() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState('');

  const fetchClients = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data.clients);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  }, [getToken]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });
      setName('');
      fetchClients();
    } catch (err) {
      console.error('Failed to save client', err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
          placeholder="Client name"
        />
        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {clients.map((c) => (
          <li key={c.id} className="rounded border p-2">
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
