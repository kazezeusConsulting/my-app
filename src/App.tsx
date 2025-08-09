// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import ReportBuilder from '@/pages/ReportBuilder';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
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
          <Route index element={<Home />} />
          <Route path="/login/*" element={<Login />} />
          <Route
            path="/report/*"
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToasterProvider>
    </BrowserRouter>
  );
}
