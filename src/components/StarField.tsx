import { useEffect, useRef, useMemo, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleDelay: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  duration: number;
}

interface StarFieldProps {
  starCount?: number;
  className?: string;
  parallaxOffset?: number;
  universeWidth?: number;
}

const StarField = ({ starCount = 400, className = '', parallaxOffset = 0, universeWidth = 4200 }: StarFieldProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Create three layers of stars with different parallax speeds across the full universe width
  const starLayers = useMemo(() => {
    const layers = [
      { count: Math.floor(starCount * 0.5), speed: 0.1, sizeRange: [0.5, 1.5] }, // Far stars - slowest
      { count: Math.floor(starCount * 0.3), speed: 0.3, sizeRange: [1, 2.5] },   // Mid stars
      { count: Math.floor(starCount * 0.2), speed: 0.5, sizeRange: [2, 3.5] },   // Near stars - fastest
    ];

    // Calculate how many viewport widths the universe spans (approximately)
    const viewportMultiplier = Math.ceil(universeWidth / 1000);

    return layers.map((layer) => {
      const stars: Star[] = [];
      // Generate more stars based on universe width
      const totalStars = layer.count * viewportMultiplier;
      for (let i = 0; i < totalStars; i++) {
        stars.push({
          x: Math.random() * 100 * viewportMultiplier, // Spread across full width
          y: Math.random() * 100,
          size: Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0],
          opacity: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 3 + 2,
          twinkleDelay: Math.random() * 5,
        });
      }
      return { stars, speed: layer.speed, widthMultiplier: viewportMultiplier };
    });
  }, [starCount, universeWidth]);

  // Spawn shooting stars every 3 seconds
  useEffect(() => {
    const spawnShootingStar = () => {
      const newStar: ShootingStar = {
        id: Date.now() + Math.random(),
        startX: Math.random() * 80 + 10,
        startY: Math.random() * 40,
        angle: Math.random() * 30 + 15,
        duration: Math.random() * 1 + 0.8,
      };
      
      setShootingStars(prev => [...prev, newStar]);
      
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
      }, newStar.duration * 1000 + 100);
    };

    // Spawn a shooting star every 3 seconds
    const interval = setInterval(() => {
      spawnShootingStar();
    }, 3000);

    // Initial spawn after a short delay
    const initialTimeout = setTimeout(spawnShootingStar, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        background: 'linear-gradient(180deg, hsl(230 40% 4%) 0%, hsl(260 50% 10%) 40%, hsl(220 60% 12%) 70%, hsl(230 40% 6%) 100%)',
      }}
    >
      {/* Drifting nebula clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large slow-moving nebula */}
        <div 
          className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4 animate-nebula-drift-slow opacity-20"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 30% 40%, hsl(280 70% 30% / 0.6) 0%, transparent 50%), radial-gradient(ellipse 50% 35% at 70% 60%, hsl(200 80% 35% / 0.5) 0%, transparent 50%)',
          }}
        />
        {/* Medium nebula layer */}
        <div 
          className="absolute w-[130%] h-[130%] -top-[15%] -left-[15%] animate-nebula-drift-medium opacity-25"
          style={{
            background: 'radial-gradient(ellipse 45% 50% at 60% 30%, hsl(260 60% 40% / 0.4) 0%, transparent 45%), radial-gradient(ellipse 40% 30% at 25% 70%, hsl(180 70% 30% / 0.4) 0%, transparent 40%)',
          }}
        />
        {/* Smaller faster nebula wisps */}
        <div 
          className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] animate-nebula-drift-fast opacity-15"
          style={{
            background: 'radial-gradient(ellipse 30% 25% at 80% 20%, hsl(300 50% 45% / 0.5) 0%, transparent 40%), radial-gradient(ellipse 35% 20% at 15% 80%, hsl(220 60% 40% / 0.4) 0%, transparent 35%)',
          }}
        />
      </div>

      {/* Static nebula base */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(280 60% 25% / 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, hsl(200 70% 30% / 0.3) 0%, transparent 50%)',
        }}
      />
      
      {/* Star layers with parallax */}
      {starLayers.map((layer, layerIndex) => (
        <div
          key={layerIndex}
          className="absolute inset-0"
          style={{
            width: `${layer.widthMultiplier * 100}%`,
            transform: `translateX(${-parallaxOffset * layer.speed}px)`,
            willChange: 'transform',
          }}
        >
          {layer.stars.map((star, index) => (
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
                animationDelay: `${star.twinkleDelay}s`,
                animationDuration: `${star.twinkleSpeed}s`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-none"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          <div
            className="relative animate-shooting-star"
            style={{
              animationDuration: `${star.duration}s`,
            }}
          >
            <div 
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'hsl(200 90% 90%)',
                boxShadow: '0 0 10px hsl(200 90% 80%), 0 0 20px hsl(200 90% 70%)',
              }}
            />
            <div 
              className="absolute top-0.5 -left-24 w-24 h-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(200 80% 80% / 0.8))',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StarField;