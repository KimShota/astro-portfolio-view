import { useEffect, useRef, useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDelay: number;
}

interface StarFieldProps {
  starCount?: number;
  className?: string;
}

const StarField = ({ starCount = 200, className = '' }: StarFieldProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const stars = useMemo(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 3 + 2,
        twinkleDelay: Math.random() * 5,
      });
    }
    return generatedStars;
  }, [starCount]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        background: 'linear-gradient(180deg, hsl(230 40% 4%) 0%, hsl(260 50% 10%) 40%, hsl(220 60% 12%) 70%, hsl(230 40% 6%) 100%)',
      }}
    >
      {/* Nebula effects */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(280 60% 25% / 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, hsl(200 70% 30% / 0.3) 0%, transparent 50%)',
        }}
      />
      
      {/* Stars */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.size > 2 ? 'hsl(200 90% 85%)' : 'hsl(210 40% 98%)',
            boxShadow: star.size > 2 
              ? `0 0 ${star.size * 3}px hsl(200 90% 70% / 0.6)` 
              : `0 0 ${star.size * 2}px hsl(210 40% 98% / 0.4)`,
            '--twinkle-duration': `${star.twinkleSpeed}s`,
            '--twinkle-delay': `${star.twinkleDelay}s`,
            animationDelay: `${star.twinkleDelay}s`,
            animationDuration: `${star.twinkleSpeed}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Shooting star effect - occasional */}
      <div className="absolute w-1 h-1 bg-star-white rounded-full opacity-0" />
    </div>
  );
};

export default StarField;
