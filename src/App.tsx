// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import ReportBuilder from '@/pages/ReportBuilder';
import Login from '@/pages/Login';
import { useAuth } from '@clerk/clerk-react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <SignedIn>
          <header className="bg-white shadow p-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Projection Report Generator</h1>
            <UserButton />
          </header>
        </SignedIn>
        <main className="py-6 px-4">
          <Routes>
            <Route path="/login/*" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <ReportBuilder />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
