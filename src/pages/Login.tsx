import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <SignIn path="/login" routing="path" afterSignInUrl="/" />
    </div>
  );
}
