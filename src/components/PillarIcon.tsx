interface PillarIconProps {
  icon: 'range' | 'quality' | 'supply' | 'expertise';
}

export function PillarIcon({ icon }: PillarIconProps) {
  const icons = {
    range: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="20" y="30" width="25" height="40" rx="2" stroke="#10b981" strokeWidth="2" fill="none" />
        <rect x="55" y="20" width="25" height="50" rx="2" stroke="#d4af37" strokeWidth="2" fill="none" />
        <rect x="35" y="45" width="25" height="25" rx="2" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>
    ),
    quality: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M50 15 L60 35 L82 38 L67 53 L71 75 L50 65 L29 75 L33 53 L18 38 L40 35 Z" 
              stroke="#d4af37" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="15" stroke="#10b981" strokeWidth="1.5" fill="none" opacity="0.5" />
      </svg>
    ),
    supply: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M15 25 L85 25 L85 75 L15 75 Z" stroke="#10b981" strokeWidth="2" fill="none" rx="4" />
        <path d="M25 35 L75 35" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M25 50 L75 50" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M25 65 L75 65" stroke="#d4af37" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="50" cy="25" r="5" fill="#10b981" />
      </svg>
    ),
    expertise: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="35" r="18" stroke="#d4af37" strokeWidth="2" fill="none" />
        <path d="M30 55 Q50 65 70 55 L70 85 L30 85 Z" stroke="#10b981" strokeWidth="2" fill="none" />
        <path d="M50 20 L50 50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="3" fill="#d4af37" />
      </svg>
    ),
  };

  return icons[icon];
}
