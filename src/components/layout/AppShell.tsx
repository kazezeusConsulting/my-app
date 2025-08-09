import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { UserButton, SignedIn } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  toolbar?: ReactNode;
}

export default function AppShell({ children, toolbar }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-100 text-foreground">
      <nav className="flex w-56 flex-col justify-between bg-gradient-to-b from-black to-blue-900 p-4 text-white">
        <div>
          <h1 className="mb-6 text-lg font-semibold">Project Report</h1>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/report"
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-2 hover:bg-blue-800',
                    isActive && 'bg-blue-800'
                  )
                }
              >
                Project Report
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-between gap-2 pt-4">
          {toolbar}
          <ThemeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
