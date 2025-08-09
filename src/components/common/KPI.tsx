import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPIProps {
  label: string;
  value: ReactNode;
  delta?: number;
}

export default function KPI({ label, value, delta }: KPIProps) {
  const Icon = delta === undefined ? null : delta >= 0 ? ArrowUpRight : ArrowDownRight;
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-semibold font-mono">{value}</span>
        {Icon && (
          <Icon
            className={cn('h-4 w-4', positive ? 'text-green-600' : 'text-red-600')}
            aria-label={positive ? 'increasing' : 'decreasing'}
          />
        )}
      </div>
    </div>
  );
}
