import type { ReactNode } from 'react';

interface ErrorStateProps {
  message: string;
  action?: ReactNode;
}

export default function ErrorState({ message, action }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border border-destructive p-8 text-center">
      <p className="text-destructive">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
