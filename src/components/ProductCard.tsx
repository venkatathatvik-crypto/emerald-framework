interface ProductCardProps {
  type: 'appliance' | 'solar' | 'kitchenware' | 'electronics';
  delay?: number;
}

export function ProductCard({ type, delay = 0 }: ProductCardProps) {
  const cards = {
    appliance: (
      <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="20" y="40" width="160" height="180" rx="12" stroke="#10b981" strokeWidth="2" fill="white" fillOpacity="0.9" />
        <rect x="30" y="50" width="140" height="120" rx="8" fill="#10b981" fillOpacity="0.1" />
        <circle cx="100" cy="200" r="15" stroke="#d4af37" strokeWidth="2" fill="none" />
        <rect x="60" y="30" width="80" height="15" rx="4" stroke="#10b981" strokeWidth="2" fill="white" fillOpacity="0.9" />
        <line x1="40" y1="180" x2="160" y2="180" stroke="#10b981" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    ),
    solar: (
      <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="30" y="60" width="140" height="100" rx="4" stroke="#d4af37" strokeWidth="2" fill="#d4af37" fillOpacity="0.15" />
        <line x1="30" y1="90" x2="170" y2="90" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="30" y1="120" x2="170" y2="120" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="100" y1="60" x2="100" y2="160" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="65" y1="60" x2="65" y2="160" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="135" y1="60" x2="135" y2="160" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.4" />
        <rect x="85" y="170" width="30" height="60" rx="4" stroke="#10b981" strokeWidth="2" fill="white" fillOpacity="0.9" />
      </svg>
    ),
    kitchenware: (
      <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="100" cy="180" rx="70" ry="50" stroke="#10b981" strokeWidth="2" fill="white" fillOpacity="0.9" />
        <ellipse cx="100" cy="180" rx="50" ry="35" stroke="#10b981" strokeWidth="1" fill="#10b981" fillOpacity="0.1" />
        <rect x="90" y="80" width="20" height="80" rx="4" stroke="#d4af37" strokeWidth="2" fill="white" fillOpacity="0.9" />
        <ellipse cx="100" cy="80" rx="15" ry="8" stroke="#d4af37" strokeWidth="2" fill="white" fillOpacity="0.9" />
      </svg>
    ),
    electronics: (
      <svg viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="25" y="50" width="150" height="120" rx="8" stroke="#d4af37" strokeWidth="2" fill="white" fillOpacity="0.9" />
        <rect x="35" y="60" width="130" height="90" rx="4" fill="#d4af37" fillOpacity="0.1" />
        <rect x="70" y="180" width="60" height="40" rx="4" stroke="#10b981" strokeWidth="2" fill="white" fillOpacity="0.9" />
        <circle cx="100" cy="200" r="8" stroke="#10b981" strokeWidth="1.5" fill="none" />
        <rect x="85" y="190" width="30" height="4" rx="2" fill="#10b981" fillOpacity="0.3" />
      </svg>
    ),
  };

  return (
    <div 
      className="floating-product-card"
      style={{ 
        animationDelay: `${delay}ms`,
      }}
    >
      {cards[type]}
    </div>
  );
}
