import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

interface Report {
  id: number;
  client_name: string;
  project_name: string;
}

export default function SavedReports() {
  const { getToken } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch('/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReports(data.reports);
      } catch (err) {
        console.error('Failed to load reports', err);
      }
    })();
  }, [getToken]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="mb-4 text-xl font-semibold">Saved Reports</h2>
      <ul className="space-y-2">
        {reports.map((r) => (
          <li key={r.id} className="rounded border p-2">
            <Link
              to={`/app/saved-reports/${r.id}`}
              className="text-blue-600 hover:underline"
            >
              {r.project_name} - {r.client_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
