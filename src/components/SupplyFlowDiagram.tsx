export function SupplyFlowDiagram() {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
        </linearGradient>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" fillOpacity="0.4" />
        </marker>
      </defs>
      
      {/* Flow path */}
      <path
        d="M50 200 Q200 100 400 200 T750 200"
        stroke="url(#flowGrad)"
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrowhead)"
        strokeDasharray="8 4"
      />
      
      {/* Nodes */}
      <circle cx="50" cy="200" r="12" fill="#10b981" fillOpacity="0.3" />
      <circle cx="50" cy="200" r="6" fill="#10b981" />
      
      <circle cx="225" cy="150" r="10" fill="#d4af37" fillOpacity="0.3" />
      <circle cx="225" cy="150" r="5" fill="#d4af37" />
      
      <circle cx="400" cy="200" r="12" fill="#10b981" fillOpacity="0.3" />
      <circle cx="400" cy="200" r="6" fill="#10b981" />
      
      <circle cx="575" cy="250" r="10" fill="#d4af37" fillOpacity="0.3" />
      <circle cx="575" cy="250" r="5" fill="#d4af37" />
      
      <circle cx="750" cy="200" r="12" fill="#10b981" fillOpacity="0.3" />
      <circle cx="750" cy="200" r="6" fill="#10b981" />
      
      {/* Connection lines */}
      <line x1="50" y1="200" x2="225" y2="150" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="225" y1="150" x2="400" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="400" y1="200" x2="575" y2="250" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="575" y1="250" x2="750" y2="200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />
      
      {/* Decorative elements */}
      <rect x="180" y="120" width="90" height="60" rx="4" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.15" fill="none" />
      <rect x="355" y="170" width="90" height="60" rx="4" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" fill="none" />
      <rect x="530" y="220" width="90" height="60" rx="4" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.15" fill="none" />
    </svg>
  );
}
