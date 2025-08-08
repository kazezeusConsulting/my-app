import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <SignIn path="/login" routing="path" afterSignInUrl={from} />
    </div>
  );
}
