export function HeroBanner() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none bg-mesh-gradient">
      {/* Dynamic line connections pattern */}
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-20"
      >
        <defs>
          <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--gold-soft)" strokeWidth="0.5" strokeOpacity="0.15" />
          </pattern>
        </defs>
        
        {/* Grid Overlay */}
        <rect width="1200" height="800" fill="url(#heroGrid)" />
        
        {/* Animated glowing nodes & paths */}
        <g stroke="var(--gold)" strokeWidth="1" strokeOpacity="0.4">
          {/* Main distribution hubs */}
          <line x1="150" y1="200" x2="450" y2="350" />
          <line x1="450" y1="350" x2="850" y2="200" />
          <line x1="450" y1="350" x2="600" y2="600" />
          <line x1="150" y1="200" x2="250" y2="500" />
          <line x1="250" y1="500" x2="600" y2="600" />
          <line x1="600" y1="600" x2="950" y2="550" />
          <line x1="850" y1="200" x2="950" y2="550" />
        </g>
        
        {/* Glowing circles */}
        <circle cx="150" cy="200" r="6" fill="var(--gold)" className="animate-pulse" />
        <circle cx="450" cy="350" r="10" fill="var(--emerald-soft)" className="animate-pulse" style={{ animationDuration: '3s' }} />
        <circle cx="850" cy="200" r="7" fill="var(--gold)" className="animate-pulse" style={{ animationDuration: '4s' }} />
        <circle cx="600" cy="600" r="9" fill="var(--emerald-soft)" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
        <circle cx="250" cy="500" r="5" fill="var(--gold)" />
        <circle cx="950" cy="550" r="6" fill="var(--gold)" />
      </svg>
      
      {/* Background gradients for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-transparent opacity-30" />
    </div>
  );
}
