
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export type AlchemicalSymbol = 
  'mercury' | 'air' | 'water' | 'fire' | 'earth' | 'spirit' | 'salt' | 'sulfur' |
  'primaMateria' | 'athanor' | 'crucible' | 'solveCoagula' | 'regulus' | 
  'quintessence' | 'scriptulum' | 'civitas' | 'hourglass' | 'scales' | 'atom' |
  'default';

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
    stroke: "currentColor", // Color will be inherited via text-accent
    strokeWidth: "1.2", // Thinner lines for the new aesthetic
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
    className: cn("transition-colors", className), // Glow removed, handled by parent
    ...props,
  };

  // Default class sets base color to accent (turquoise), can be overridden by `className` prop
  const defaultColoredIconProps = {
    ...iconProps,
    // className: cn("text-accent", className), // Color is set by parent now
  };


  switch (symbol) {
    case 'mercury': // Good for Economy, Trade, Messages
      return (
        <svg {...defaultColoredIconProps} aria-label="Mercury Symbol">
          <circle cx="12" cy="6" r="3.5" />
          <line x1="12" y1="9.5" x2="12" y2="17.5" />
          <line x1="8.5" y1="13.5" x2="15.5" y2="13.5" />
          <path d="M8.5 17.5 A3.5 3.5 0 0 0 12 21 A3.5 3.5 0 0 0 15.5 17.5" />
        </svg>
      );
    case 'air': // Good for Languages, Philosophy, Intellect
      return (
        <svg {...defaultColoredIconProps} aria-label="Air Symbol">
          <path d="M12 4 L4 20 H20 Z" />
          <line x1="6" y1="14" x2="18" y2="14" />
        </svg>
      );
    case 'water': // Good for Culture, Emotions, Arts
      return (
        <svg {...defaultColoredIconProps} aria-label="Water Symbol">
          <path d="M12 20 L4 4 H20 Z" />
        </svg>
      );
    case 'fire': // Good for Military, Industry, Transformation
       return (
        <svg {...defaultColoredIconProps} aria-label="Fire Symbol">
          <path d="M12 4 L4 20 H20 Z" />
        </svg>
      );
    case 'earth': // Good for Geography, Stability, Resources
      return (
        <svg {...defaultColoredIconProps} aria-label="Earth Symbol">
          <path d="M12 20 L4 4 H20 Z" />
          <line x1="6" y1="10" x2="18" y2="10" />
        </svg>
      );
    case 'spirit': // Good for Religion, Core Values, Overall Lore
      return (
        <svg {...defaultColoredIconProps} aria-label="Spirit Symbol">
          <circle cx="12" cy="12" r="7" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="7.1" y1="7.1" x2="16.9" y2="16.9" />
          <line x1="7.1" y1="16.9" x2="16.9" y2="7.1" />
        </svg>
      );
    case 'salt': // Good for Society, Law, Structure
      return (
        <svg {...defaultColoredIconProps} aria-label="Salt Symbol">
          <circle cx="12" cy="12" r="7" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'sulfur': // Good for Passion, Conflict, Driving Forces
      return (
        <svg {...defaultColoredIconProps} aria-label="Sulfur Symbol">
          <path d="M12 4 L7 12 H17 Z" /> {/* Triangle */}
          <line x1="12" y1="12" x2="12" y2="20" /> {/* Vertical line of cross */}
          <line x1="9" y1="16" x2="15" y2="16" /> {/* Horizontal line of cross */}
        </svg>
      );
    case 'primaMateria': // Geography, Foundation
      return (
        <svg {...defaultColoredIconProps} aria-label="Prima Materia Symbol">
          <circle cx="12" cy="12" r="8" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'athanor': // History, Government, Long Processes
      return (
        <svg {...defaultColoredIconProps} aria-label="Athanor Symbol">
          <path d="M8 20V10L6 8V4h12v4l-2 2v10H8zm4-10h0" /> {/* Simplified furnace */}
          <line x1="10" y1="14" x2="14" y2="14" />
          <line x1="10" y1="17" x2="14" y2="17" />
        </svg>
      );
    case 'crucible': // Economy, Industry, Transformation
      return (
        <svg {...defaultColoredIconProps} aria-label="Crucible Symbol">
          <path d="M6 8 H18 L16 16 H8 Z" />
          <path d="M10 16 Q12 20 14 16" />
          <line x1="6" y1="8" x2="8" y2="4" />
          <line x1="18" y1="8" x2="16" y2="4" />
        </svg>
      );
    case 'solveCoagula': // Politics, Diplomacy, Social Dynamics
      return (
        <svg {...defaultColoredIconProps} aria-label="Solve et Coagula Symbol">
          <path d="M8 8l4 4 4-4" />
          <path d="M8 16l4-4 4 4" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      );
    case 'regulus': // Military, Nobility, Power
      return (
        <svg {...defaultColoredIconProps} aria-label="Regulus Symbol">
          <path d="M12 2 L14.3 8.9 L21 9.5 L15.8 14.3 L17.6 21 L12 17 L6.4 21 L8.2 14.3 L3 9.5 L9.7 8.9 Z" />
        </svg>
      );
    case 'quintessence': // Religion, Magic, Art, Core Essence
      return (
        <svg {...defaultColoredIconProps} aria-label="Quintessence Symbol">
           <path d="M12 2l2.12 6.56h6.88l-5.56 4.08 2.12 6.56L12 15.12l-5.56 4.08 2.12-6.56L3 8.56h6.88L12 2z"/>
        </svg>
      );
    case 'scriptulum': // Languages, Documents, Literature
      return (
        <svg {...defaultColoredIconProps} aria-label="Scriptulum Symbol">
          <path d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" />
          <path d="M14 8L8 14" />
          <path d="M10 8L8 10" />
          <path d="M16 12L14 14" />
        </svg>
      );
    case 'civitas': // Cities, Society Structure
      return (
        <svg {...defaultColoredIconProps} aria-label="Civitas Symbol">
          <path d="M4 20L4 8L12 2L20 8L20 20L16 20L16 12L8 12L8 20L4 20Z"/>
          <path d="M10 12L10 20"/>
          <path d="M14 12L14 20"/>
        </svg>
      );
     case 'hourglass': // History, Time
      return (
        <svg {...defaultColoredIconProps} aria-label="Hourglass Symbol">
          <path d="M6 2v4h12V2M6 22v-4h12v4M12 6L8 10h8L12 6zm0 12l4-4H8l4 4z"/>
          <line x1="6" y1="6" x2="18" y2="6"/>
          <line x1="6" y1="18" x2="18" y2="18"/>
        </svg>
      );
    case 'scales': // Law, Justice, Balance
      return (
        <svg {...defaultColoredIconProps} aria-label="Scales Symbol">
          <path d="M12 3L3 7V12L12 21L21 12V7L12 3Z"/>
          <path d="M3 7L12 12L21 7"/>
          <path d="M12 12V21"/>
          <path d="M5 10L2 12"/>
          <path d="M19 10L22 12"/>
        </svg>
      );
    case 'atom': // Technology, Science, Magic Systems
      return (
        <svg {...defaultColoredIconProps} aria-label="Atom Symbol">
          <circle cx="12" cy="12" r="1"/>
          <path d="M12 2a10 10 0 0 0-2.6 19.6M12 2a10 10 0 0 1 2.6 19.6"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/>
        </svg>
      );
    default:
    case 'default':
      return (
        <svg {...defaultColoredIconProps} aria-label="Default Alchemical Symbol">
          <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};
