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
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b bg-card px-4 py-2">
        <h1 className="text-xl font-semibold">Projection Builder</h1>
        <div className="flex items-center gap-2">
          {toolbar}
          <ThemeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/login" />
          </SignedIn>
        </div>
      </header>
      <div className="grid md:grid-cols-[200px,1fr] lg:grid-cols-[240px,1fr] min-h-[calc(100vh-3rem)]">
        <nav className="hidden md:block border-r p-4">
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-2 hover:bg-muted',
                    isActive && 'bg-muted'
                  )
                }
              >
                Report Builder
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
