export function FounderPortrait() {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="portraitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.05" />
        </linearGradient>
        <filter id="portraitBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
      </defs>
      
      {/* Background gradient */}
      <rect width="400" height="500" fill="url(#portraitGrad)" />
      
      {/* Abstract portrait silhouette */}
      <ellipse cx="200" cy="180" rx="80" ry="100" fill="#10b981" fillOpacity="0.1" filter="url(#portraitBlur)" />
      
      {/* Shoulders/body shape */}
      <path
        d="M100 280 Q200 250 300 280 L300 500 L100 500 Z"
        fill="#10b981"
        fillOpacity="0.08"
        filter="url(#portraitBlur)"
      />
      
      {/* Decorative elements */}
      <circle cx="200" cy="180" r="60" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.2" fill="none" />
      <circle cx="200" cy="180" r="80" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
      
      {/* Initials */}
      <text
        x="200"
        y="200"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="80"
        fill="#10b981"
        fillOpacity="0.3"
        fontWeight="bold"
      >
        SP
      </text>
      
      {/* Accent lines */}
      <line x1="120" y1="350" x2="280" y2="350" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="140" y1="370" x2="260" y2="370" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.15" />
    </svg>
  );
}
