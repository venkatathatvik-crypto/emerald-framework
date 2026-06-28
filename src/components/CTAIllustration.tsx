export function CTAIllustration() {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-25"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      {/* Upward arrow/growth symbol */}
      <path
        d="M300 350 L300 100"
        stroke="url(#ctaGrad)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Arrow head */}
      <path
        d="M250 150 L300 100 L350 150"
        stroke="url(#ctaGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Radiating circles */}
      <circle cx="300" cy="200" r="80" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" fill="none" />
      <circle cx="300" cy="200" r="120" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.15" fill="none" />
      <circle cx="300" cy="200" r="160" stroke="#10b981" strokeWidth="1" strokeOpacity="0.1" fill="none" />
      
      {/* Decorative elements */}
      <circle cx="200" cy="150" r="15" fill="#d4af37" fillOpacity="0.1" />
      <circle cx="400" cy="150" r="15" fill="#d4af37" fillOpacity="0.1" />
      <circle cx="150" cy="250" r="10" fill="#10b981" fillOpacity="0.1" />
      <circle cx="450" cy="250" r="10" fill="#10b981" fillOpacity="0.1" />
      
      {/* Small connecting lines */}
      <line x1="200" y1="150" x2="300" y2="200" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="400" y1="150" x2="300" y2="200" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.15" />
      <line x1="150" y1="250" x2="300" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.1" />
      <line x1="450" y1="250" x2="300" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.1" />
    </svg>
  );
}
