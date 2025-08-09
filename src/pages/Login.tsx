import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/app/report';
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <SignIn path="/login" routing="path" afterSignInUrl={from} />
    </div>
  );
}
