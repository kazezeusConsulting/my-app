import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/report" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <SignInButton mode="modal">
        <button className="rounded-md bg-blue-600 px-6 py-3 text-white shadow transition-colors hover:bg-blue-700">
          Log In
        </button>
      </SignInButton>
    </div>
  );
}
