import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import type { FormValues, Projection } from '@/types/formTypes';
import calculateProjections from '@/utils/calculateProjections';
import ReportOutput from '@/components/ReportOutput';

export default function SavedReport() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [results, setResults] = useState<Projection[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`/api/reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const reportData: FormValues = data.report.data;
        setFormData(reportData);
        const raw = calculateProjections(reportData);
        const projections = raw.map((p, i) => ({
          ...p,
          year: Number.isFinite(p.year) ? p.year : i + 1,
        }));
        setResults(projections);
      } catch (err) {
        console.error('Failed to load report', err);
      }
    })();
  }, [id, getToken]);

  if (!formData || results.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Link to="/app/saved-reports" className="mb-6 inline-block rounded bg-gray-200 px-4 py-2">
        Back to list
      </Link>
      <ReportOutput formData={formData} results={results} />
    </div>
  );
}
