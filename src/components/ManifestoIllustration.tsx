export function ManifestoIllustration() {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-30"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="manifestoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      {/* Abstract network/connections */}
      <circle cx="100" cy="100" r="40" fill="url(#manifestoGrad)" />
      <circle cx="300" cy="150" r="60" fill="url(#manifestoGrad)" />
      <circle cx="500" cy="100" r="40" fill="url(#manifestoGrad)" />
      <circle cx="200" cy="300" r="50" fill="url(#manifestoGrad)" />
      <circle cx="400" cy="280" r="45" fill="url(#manifestoGrad)" />
      
      {/* Connection lines */}
      <line x1="100" y1="100" x2="300" y2="150" stroke="#10b981" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="300" y1="150" x2="500" y2="100" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="100" y1="100" x2="200" y2="300" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="300" y1="150" x2="200" y2="300" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="300" y1="150" x2="400" y2="280" stroke="#10b981" strokeWidth="1" strokeOpacity="0.25" />
      <line x1="500" y1="100" x2="400" y2="280" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="200" y1="300" x2="400" y2="280" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
      
      {/* Small accent dots */}
      <circle cx="150" cy="200" r="8" fill="#d4af37" fillOpacity="0.15" />
      <circle cx="350" cy="200" r="6" fill="#10b981" fillOpacity="0.15" />
      <circle cx="450" cy="180" r="5" fill="#d4af37" fillOpacity="0.1" />
    </svg>
  );
}
