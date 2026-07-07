import type { ReactNode } from 'react';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';

interface EndpointCardProps {
  title: string;
  className?: string;
  children: ReactNode;
}

export function EndpointCard({ title, className = '', children }: EndpointCardProps) {
  return (
    <MagicCard
      className={`p-4 flex flex-col gap-3 ${className}`}
      gradientColor="rgba(255, 255, 255, 0.05)"
    >
      <BorderBeam size={150} duration={12} delay={9} borderWidth={1.5} />
      <h2 className="text-sm font-medium text-white/70 uppercase tracking-wide">
        {title}
      </h2>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
    </MagicCard>
  );
}
