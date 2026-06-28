export function StatsIllustration() {
  return (
    <svg
      viewBox="0 0 800 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-25"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="statsGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      
      {/* Growth bars */}
      <rect x="50" y="200" width="80" height="80" rx="4" fill="url(#statsGrad)" opacity="0.6" />
      <rect x="180" y="150" width="80" height="130" rx="4" fill="url(#statsGrad)" opacity="0.7" />
      <rect x="310" y="100" width="80" height="180" rx="4" fill="url(#statsGrad)" opacity="0.8" />
      <rect x="440" y="60" width="80" height="220" rx="4" fill="url(#statsGrad)" opacity="0.9" />
      <rect x="570" y="30" width="80" height="250" rx="4" fill="url(#statsGrad)" />
      
      {/* Growth line */}
      <path
        d="M90 200 L220 150 L350 100 L480 60 L610 30"
        stroke="#d4af37"
        strokeWidth="3"
        fill="none"
        strokeOpacity="0.5"
      />
      
      {/* Data points */}
      <circle cx="90" cy="200" r="6" fill="#10b981" />
      <circle cx="220" cy="150" r="6" fill="#10b981" />
      <circle cx="350" cy="100" r="6" fill="#d4af37" />
      <circle cx="480" cy="60" r="6" fill="#d4af37" />
      <circle cx="610" cy="30" r="6" fill="#d4af37" />
      
      {/* Grid lines */}
      <line x1="30" y1="250" x2="670" y2="250" stroke="#10b981" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
      <line x1="30" y1="180" x2="670" y2="180" stroke="#10b981" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
      <line x1="30" y1="110" x2="670" y2="110" stroke="#10b981" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
    </svg>
  );
}
