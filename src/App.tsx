// src/App.tsx
import ReportBuilder from '@/pages/ReportBuilder';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projection Report Generator</h1>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="py-6 px-4">
        <SignedIn>
          <ReportBuilder />
        </SignedIn>
        <SignedOut>
          <p>Please sign in to build reports.</p>
        </SignedOut>
      </main>
    </div>
  );
}
