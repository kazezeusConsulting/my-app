import { SignInButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/app/report" />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="flex w-full flex-1 items-center justify-center bg-gray-800/60 p-8 backdrop-blur-sm">
        <SignInButton mode="modal">
          <button className="rounded-md bg-blue-600 px-6 py-3 text-white shadow-lg transition-colors hover:bg-blue-700">
            Log In
          </button>
        </SignInButton>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Kazezeus Finance</h1>
        <p className="max-w-md text-lg text-gray-300">
          Empowering your financial journey with smart solutions.
        </p>
      </div>
    </div>
  );
}
