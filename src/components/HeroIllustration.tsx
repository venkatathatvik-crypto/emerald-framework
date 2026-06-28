export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-40"
      aria-hidden="true"
    >
      {/* Abstract flowing shapes */}
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
        </linearGradient>
        <filter id="blur1">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
        </filter>
      </defs>
      
      {/* Large flowing curve */}
      <path
        d="M-100 400 Q200 200 400 300 T800 200 L800 600 L-100 600 Z"
        fill="url(#grad1)"
        filter="url(#blur1)"
      />
      
      {/* Secondary curve */}
      <path
        d="M0 500 Q300 350 500 450 T900 350 L900 600 L0 600 Z"
        fill="url(#grad2)"
        filter="url(#blur1)"
      />
      
      {/* Floating circles */}
      <circle cx="150" cy="150" r="60" fill="#10b981" fillOpacity="0.08" filter="url(#blur1)" />
      <circle cx="650" cy="100" r="80" fill="#d4af37" fillOpacity="0.06" filter="url(#blur1)" />
      <circle cx="700" cy="450" r="50" fill="#10b981" fillOpacity="0.05" filter="url(#blur1)" />
      
      {/* Geometric lines */}
      <line x1="100" y1="100" x2="200" y2="200" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="600" y1="150" x2="700" y2="250" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.15" />
      <line x1="500" y1="400" x2="600" y2="500" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" />
    </svg>
  );
}
