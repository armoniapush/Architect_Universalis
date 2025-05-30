import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export type AlchemicalSymbol = 'mercury' | 'air' | 'water' | 'fire' | 'earth' | 'spirit' | 'salt' | 'sulfur';

interface AlchemicalIconProps extends SVGProps<SVGSVGElement> {
  symbol: AlchemicalSymbol;
  size?: number | string;
}

export const AlchemicalIcon = ({ symbol, size = 24, className, ...props }: AlchemicalIconProps) => {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
    className: cn("text-accent", className),
    ...props,
  };

  switch (symbol) {
    case 'mercury':
      return (
        <svg {...iconProps} aria-label="Mercury Symbol">
          <circle cx="12" cy="6" r="3.5" />
          <line x1="12" y1="9.5" x2="12" y2="17.5" />
          <line x1="8.5" y1="13.5" x2="15.5" y2="13.5" />
          <path d="M8.5 17.5 A3.5 3.5 0 0 0 12 21 A3.5 3.5 0 0 0 15.5 17.5" />
        </svg>
      );
    case 'air':
      return (
        <svg {...iconProps} aria-label="Air Symbol">
          <path d="M12 4 L4 20 H20 Z" />
          <line x1="6" y1="14" x2="18" y2="14" />
        </svg>
      );
    case 'water':
      return (
        <svg {...iconProps} aria-label="Water Symbol">
          <path d="M12 20 L4 4 H20 Z" />
        </svg>
      );
    case 'fire':
       return (
        <svg {...iconProps} aria-label="Fire Symbol">
          <path d="M12 4 L4 20 H20 Z" />
        </svg>
      );
    case 'earth':
      return (
        <svg {...iconProps} aria-label="Earth Symbol">
          <path d="M12 20 L4 4 H20 Z" />
          <line x1="6" y1="10" x2="18" y2="10" />
        </svg>
      );
    default: // Fallback to a generic symbol or null
      return (
        <svg {...iconProps} aria-label="Generic Alchemical Symbol">
          <circle cx="12" cy="12" r="8" />
          <line x1="12" y1="6" x2="12" y2="18" />
          <line x1="6" y1="12" x2="18" y2="12" />
        </svg>
      );
  }
};
