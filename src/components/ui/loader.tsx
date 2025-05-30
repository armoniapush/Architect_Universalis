import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: number | string;
  text?: string;
}

export const Loader = ({ className, size = "1.5rem", text }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-primary" role="status" aria-live="polite">
      <Loader2
        className={cn('animate-spin', className)}
        style={{ width: size, height: size }}
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};
