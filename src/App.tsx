// src/App.tsx
import ReportBuilder from "@/pages/ReportBuilder";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-semibold">Projection Report Generator</h1>
      </header>
      <main className="py-6 px-4">
        <ReportBuilder />
      </main>
    </div>
  );
}
