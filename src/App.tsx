// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import ReportBuilder from '@/pages/ReportBuilder';
import Login from '@/pages/Login';
import { useAuth } from '@clerk/clerk-react';
import AppShell from '@/components/layout/AppShell';
import { ToasterProvider } from '@/components/feedback/Toaster';

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
      <ToasterProvider>
        <Routes>
          <Route path="/login/*" element={<Login />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppShell>
                  <Routes>
                    <Route index element={<ReportBuilder />} />
                  </Routes>
                </AppShell>
              </RequireAuth>
            }
          />
        </Routes>
      </ToasterProvider>
    </BrowserRouter>
  );
}
