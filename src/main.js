import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment, forwardRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion is imported at the top

// Utility function (cn equivalent)
function cn(...inputs) {
      return inputs.filter(Boolean).join(' ');
}

// Helper function to resolve asset paths relative to base for GitHub Pages
// This ensures relative paths work correctly with React Router sub-routes
function resolveAssetPath(path) {
  // If path is already absolute (starts with /), return as-is (Vite will handle base)
  if (path.startsWith('/')) {
    return path;
  }
  // For relative paths, ensure they resolve from the base
  // In GitHub Pages with base /astro-portfolio-view/, we need to prepend it
  return `/astro-portfolio-view/${path}`;
}


// Simple Button component
function Button({ children, className = '', variant = 'default', size = 'default', onClick, asChild, ...props }) {
  const baseClasses = 'btn';
  const variantClasses = {
        cosmos: 'btn-cosmos',
        cosmosOutline: 'btn-cosmos-outline',
      };
  const sizeClasses = {
        lg: 'btn-lg',
        xl: 'btn-xl',
      };
      
  const classes = cn(
        baseClasses,
        variantClasses[variant] || '',
        sizeClasses[size] || '',
        className
      );
      
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { className: classes, ...props });
      }
      
      return React.createElement('button', { className: classes, onClick, ...props }, children);
}

// StarField Component
function StarField({ starCount = 400, className = '', parallaxOffset = 0 }) {
  const containerRef = useRef(null);
      const [shootingStars, setShootingStars] = useState([]);

  const starLayers = useMemo(() => {
    const layers = [
          { count: Math.floor(starCount * 0.5), speed: 0.1, sizeRange: [0.5, 1.5] },
          { count: Math.floor(starCount * 0.3), speed: 0.3, sizeRange: [1, 2.5] },
          { count: Math.floor(starCount * 0.2), speed: 0.5, sizeRange: [2, 3.5] },
        ];

        return layers.map((layer) => {
      const stars = [];
          for (let i = 0; i < layer.count; i++) {
            stars.push({
              x: Math.random() * 100,
              y: Math.random() * 100,
              size: Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0],
              opacity: Math.random() * 0.5 + 0.3,
              twinkleSpeed: Math.random() * 3 + 2,
              twinkleDelay: Math.random() * 5,
            });
          }
          return { stars, speed: layer.speed };
        });
      }, [starCount]);

      useEffect(() => {
    const spawnShootingStar = () => {
      const newStar = {
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

    const interval = setInterval(() => {
          spawnShootingStar();
        }, 3000);

    const initialTimeout = setTimeout(spawnShootingStar, 1000);

        return () => {
          clearInterval(interval);
          clearTimeout(initialTimeout);
        };
      }, []);

      return React.createElement('div', {
        ref: containerRef,
        className: `fixed inset-0 overflow-hidden pointer-events-none ${className}`,
        style: {
          background: 'linear-gradient(180deg, hsl(230 40% 4%) 0%, hsl(260 50% 10%) 40%, hsl(220 60% 12%) 70%, hsl(230 40% 6%) 100%)',
        }
      }, [
        React.createElement('div', { key: 'nebula-container', className: 'absolute inset-0 overflow-hidden' }, [
          React.createElement('div', {
            key: 'nebula-slow',
            className: 'absolute w-[150%] h-[150%] -top-1/4 -left-1/4 animate-nebula-drift-slow opacity-20',
            style: {
              background: 'radial-gradient(ellipse 60% 40% at 30% 40%, hsl(280 70% 30% / 0.6) 0%, transparent 50%), radial-gradient(ellipse 50% 35% at 70% 60%, hsl(200 80% 35% / 0.5) 0%, transparent 50%)',
            }
          }),
          React.createElement('div', {
            key: 'nebula-medium',
            className: 'absolute w-[130%] h-[130%] -top-[15%] -left-[15%] animate-nebula-drift-medium opacity-25',
            style: {
              background: 'radial-gradient(ellipse 45% 50% at 60% 30%, hsl(260 60% 40% / 0.4) 0%, transparent 45%), radial-gradient(ellipse 40% 30% at 25% 70%, hsl(180 70% 30% / 0.4) 0%, transparent 40%)',
            }
          }),
          React.createElement('div', {
            key: 'nebula-fast',
            className: 'absolute w-[120%] h-[120%] -top-[10%] -left-[10%] animate-nebula-drift-fast opacity-15',
            style: {
              background: 'radial-gradient(ellipse 30% 25% at 80% 20%, hsl(300 50% 45% / 0.5) 0%, transparent 40%), radial-gradient(ellipse 35% 20% at 15% 80%, hsl(220 60% 40% / 0.4) 0%, transparent 35%)',
            }
          }),
        ]),
        React.createElement('div', {
          key: 'nebula-base',
          className: 'absolute inset-0 opacity-30',
          style: {
            background: 'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(280 60% 25% / 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, hsl(200 70% 30% / 0.3) 0%, transparent 50%)',
          }
        }),
        ...starLayers.map((layer, layerIndex) =>
          React.createElement('div', {
            key: `layer-${layerIndex}`,
            className: 'absolute inset-0',
            style: {
              transform: `translateX(${-parallaxOffset * layer.speed}px)`,
              willChange: 'transform',
            }
          }, layer.stars.map((star, index) =>
            React.createElement('div', {
              key: `star-${layerIndex}-${index}`,
              className: 'absolute rounded-full animate-twinkle',
              style: {
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
              }
            })
          ))
        ),
        ...shootingStars.map((star) =>
          React.createElement('div', {
            key: star.id,
            className: 'absolute pointer-events-none',
            style: {
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              transform: `rotate(${star.angle}deg)`,
            }
          }, React.createElement('div', {
            className: 'relative animate-shooting-star',
            style: {
              animationDuration: `${star.duration}s`,
            }
          }, [
            React.createElement('div', {
              key: 'star-core',
              className: 'absolute w-2 h-2 rounded-full',
              style: {
                background: 'hsl(200 90% 90%)',
                boxShadow: '0 0 10px hsl(200 90% 80%), 0 0 20px hsl(200 90% 70%)',
              }
            }),
            React.createElement('div', {
              key: 'star-tail',
              className: 'absolute top-0.5 -left-24 w-24 h-1 rounded-full',
              style: {
                background: 'linear-gradient(90deg, transparent, hsl(200 80% 80% / 0.8))',
              }
            }),
          ]))
        ),
      ]);
}

// Constellation Component
function Constellation({ name, image, position, onClick }) {
      return React.createElement(motion.div, {
        className: 'absolute cursor-pointer group',
        style: {
          left: `${position.x}px`,
          top: `${position.y}px`,
        },
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: 'easeOut' },
        whileHover: { scale: 1.05 },
        onClick: onClick,
      }, [
        React.createElement('div', {
          key: 'glow',
          className: 'absolute inset-0 blur-2xl bg-accent/20 rounded-full scale-75 group-hover:scale-100 group-hover:bg-accent/30 transition-all duration-500'
        }),
        React.createElement(motion.img, {
          key: 'image',
          src: resolveAssetPath(image),
          alt: name,
          className: 'relative w-48 h-48 md:w-64 md:h-64 object-contain constellation-glow transition-all duration-300 group-hover:brightness-125',
          draggable: false,
          animate: { y: [0, -8, 0] },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        }),
        React.createElement(motion.div, {
          key: 'label',
          className: 'absolute -bottom-8 left-1/2 -translate-x-1/2 text-center',
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.3 }
        }, React.createElement('span', {
          className: 'font-display text-sm md:text-base text-foreground/80 tracking-widest uppercase group-hover:text-primary transition-colors duration-300'
        }, name)),
        React.createElement('div', {
          key: 'indicator',
          className: 'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        }, React.createElement('div', {
          className: 'bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/40'
        }, React.createElement('span', {
          className: 'text-primary text-xs font-display tracking-wider'
        }, 'Click to view')))
      ]);
}

// ConstellationModal Component
function ConstellationModal({ project, isOpen, onClose }) {
      if (!project) return null;

      if (!isOpen) return null;

      return React.createElement(AnimatePresence, null,
        React.createElement(motion.div, {
          key: 'backdrop',
          className: 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: onClose
        }),
        React.createElement(motion.div, {
          key: 'modal',
          className: 'fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center',
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { type: 'spring', duration: 0.5 }
        }, React.createElement('div', {
          className: 'relative w-full h-full max-w-6xl mx-auto bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-2xl'
        }, [
          React.createElement('button', {
            key: 'close',
            onClick: onClose,
            className: 'absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors'
          }, React.createElement('svg', {
            className: 'w-6 h-6 text-foreground',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M6 18L18 6M6 6l12 12'
          }))),
          React.createElement('div', {
            key: 'content',
            className: 'flex flex-col md:flex-row h-full'
          }, [
            React.createElement('div', {
              key: 'left',
              className: 'flex-1 p-6 md:p-10 flex flex-col justify-center'
            }, React.createElement(motion.div, {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.2 }
            }, [
              React.createElement('span', {
                key: 'label',
                className: 'text-accent text-sm font-display tracking-widest uppercase'
              }, `${project.name} Constellation`),
              React.createElement('h2', {
                key: 'title',
                className: 'font-display text-3xl md:text-4xl lg:text-5xl mt-2 mb-4 text-foreground'
              }, project.title),
              React.createElement('p', {
                key: 'description',
                className: 'text-muted-foreground text-base md:text-lg leading-relaxed mb-6'
              }, project.description),
              React.createElement('div', {
                key: 'tech',
                className: 'flex flex-wrap gap-2 mb-8'
              }, project.technologies.map((tech) =>
                React.createElement('span', {
                  key: tech,
                  className: 'px-3 py-1 text-sm bg-muted rounded-full text-muted-foreground border border-border/50'
                }, tech)
              )),
              React.createElement(Button, {
                key: 'link',
                variant: 'cosmos',
                size: 'lg',
                asChild: true
              }, React.createElement('a', {
                href: project.link,
                target: '_blank',
                rel: 'noopener noreferrer'
              }, [
                'View Project',
                React.createElement('svg', {
                  key: 'icon',
                  className: 'w-4 h-4 ml-2',
                  fill: 'none',
                  stroke: 'currentColor',
                  viewBox: '0 0 24 24'
                }, React.createElement('path', {
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 2,
                  d: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                }))
              ]))
            ])),
            React.createElement(motion.div, {
              key: 'right',
              className: 'flex-1 relative bg-muted/30',
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.3 }
            }, [
              React.createElement('img', {
                key: 'img',
                src: resolveAssetPath(project.image),
                alt: project.title,
                className: 'w-full h-full object-cover'
              }),
              React.createElement('div', {
                key: 'gradient',
                className: 'absolute inset-0 bg-gradient-to-l from-transparent to-card/50'
              })
            ])
          ]),
          React.createElement('div', {
            key: 'back-mobile',
            className: 'absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden'
          }, React.createElement(Button, {
            variant: 'cosmosOutline',
            onClick: onClose
          }, 'Back to Universe'))
        ]))
      )
}

// MenuOverlay Component
function MenuOverlay({ isOpen, onClose }) {
  const menuItems = [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Who', path: '/who', icon: 'User' },
      ];

  const IconComponent = ({ name, className }) => {
    const icons = {
          Home: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
          ),
          User: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
          ),
          X: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M6 18L18 6M6 6l12 12' })
          ),
        };
        return icons[name] || null;
      };

      return React.createElement(AnimatePresence, {}, isOpen && [
        React.createElement(motion.div, {
          key: 'backdrop',
          className: 'fixed inset-0 bg-background/90 backdrop-blur-md z-50',
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: onClose
        }),
        React.createElement(motion.div, {
          key: 'menu',
          className: 'fixed inset-0 z-50 flex items-center justify-center',
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }, [
          React.createElement('button', {
            key: 'close',
            onClick: onClose,
            className: 'absolute top-6 right-6 p-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all'
          }, React.createElement(IconComponent, { name: 'X', className: 'w-6 h-6 text-foreground' })),
          React.createElement('nav', {
            key: 'nav',
            className: 'flex flex-col items-center gap-8'
          }, menuItems.map((item, index) =>
            React.createElement(motion.div, {
              key: item.path,
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 30 },
              transition: { delay: index * 0.1 }
            }, React.createElement(Link, {
              to: item.path,
              onClick: onClose,
              className: 'group flex items-center gap-4 text-4xl md:text-6xl font-display tracking-widest text-foreground/70 hover:text-primary transition-colors duration-300'
            }, [
              React.createElement(IconComponent, {
                key: 'icon',
                name: item.icon,
                className: 'w-8 h-8 md:w-12 md:h-12 opacity-50 group-hover:opacity-100 transition-opacity'
              }),
              item.label
            ]))
          ))
        ])
      ]);
}

// Index Page
function Index() {
  const navigate = useNavigate();

      return React.createElement('div', { className: 'relative min-h-screen overflow-hidden' }, [
        React.createElement(StarField, { key: 'stars', starCount: 250 }),
        React.createElement('div', {
          key: 'content',
          className: 'relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center'
        }, [
          React.createElement(motion.div, {
            key: 'title',
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, ease: 'easeOut' }
          }, React.createElement('h1', {
            className: 'font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4'
          }, [
            React.createElement('span', { key: 'my', className: 'text-foreground' }, 'SHOTA\'S'),
            React.createElement('br', { key: 'br' }),
            React.createElement('span', { key: 'universe', className: 'text-gradient-gold' }, 'UNIVERSE')
          ])),
          React.createElement(motion.div, {
            key: 'description',
            className: 'max-w-2xl mx-auto mt-6 mb-10',
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' }
          }, React.createElement('p', {
            className: 'text-muted-foreground text-lg md:text-xl leading-relaxed'
          }, 'Welcome to Shota\'s universe! Each constellation represents my personal or group projects, so explore them as you wish. Click and drag or swipe horizontally to explore my universe, and learn about each project and me as a pseron!')),
          React.createElement(motion.div, {
            key: 'button',
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.6, delay: 0.6, ease: 'easeOut' }
          }, React.createElement(Button, {
            variant: 'cosmos',
            size: 'xl',
            onClick: () => navigate('/universe'),
            className: 'relative overflow-hidden group'
          }, [
            React.createElement('span', { key: 'text', className: 'relative z-10' }, 'Start Exploring My Universe'),
            React.createElement(motion.div, {
              key: 'hover',
              className: 'absolute inset-0 bg-primary/20',
              initial: { x: '-100%' },
              whileHover: { x: 0 },
              transition: { duration: 0.3 }
            })
          ])),
          React.createElement(motion.div, {
            key: 'hint',
            className: 'absolute bottom-10 left-1/2 -translate-x-1/2',
            animate: { y: [0, -10, 0] },
            transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }, React.createElement('div', {
            className: 'flex items-center gap-2 text-muted-foreground/50 text-sm'
          }, [
            React.createElement('span', { key: 'line1', className: 'w-4 h-[1px] bg-muted-foreground/50' }),
            React.createElement('span', { key: 'text' }, 'Scroll down or click to begin'),
            React.createElement('span', { key: 'line2', className: 'w-4 h-[1px] bg-muted-foreground/50' })
          ]))
        ])
      ]);
}

// Who Page
function Who() {
  const navigate = useNavigate();

  const skills = [
        { category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'] },
        { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL'] },
        { category: 'Design', items: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'Design Systems'] },
        { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD'] },
      ];

  const socialLinks = [
        { name: 'Email', icon: 'Mail', href: 'mailto:hello@example.com' },
        { name: 'GitHub', icon: 'Github', href: '#' },
        { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
        { name: 'Twitter', icon: 'Twitter', href: '#' },
      ];

  const IconComponent = ({ name, className }) => {
    const icons = {
          ArrowLeft: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M10 19l-7-7m0 0l7-7m-7 7h18' })
          ),
          Mail: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
          ),
          Github: React.createElement('svg', { className, fill: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' })
          ),
          Linkedin: React.createElement('svg', { className, fill: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' })
          ),
          Twitter: React.createElement('svg', { className, fill: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { d: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' })
          ),
        };
        return icons[name] || null;
      };

      return React.createElement('div', { className: 'relative min-h-screen overflow-hidden' }, [
        React.createElement(StarField, { key: 'stars', starCount: 150 }),
        React.createElement(motion.button, {
          key: 'back',
          className: 'fixed top-6 left-6 z-40 p-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all',
          onClick: () => navigate('/universe'),
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 }
        }, React.createElement(IconComponent, { name: 'ArrowLeft', className: 'w-6 h-6 text-foreground' })),
        React.createElement('div', {
          key: 'content',
          className: 'relative z-10 min-h-screen'
        }, [
          React.createElement('section', {
            key: 'hero',
            className: 'min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 py-20 lg:py-10 gap-10 lg:gap-20'
          }, [
            React.createElement(motion.div, {
              key: 'photo',
              className: 'flex-shrink-0',
              initial: { opacity: 0, x: -50 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.6 }
            }, React.createElement('div', { className: 'relative' }, [
              React.createElement('div', {
                className: 'w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 glow-gold'
              }, React.createElement('div', {
                className: 'w-full h-full bg-gradient-to-br from-cosmos-purple to-cosmos-blue flex items-center justify-center'
              }, React.createElement('span', {
                className: 'font-display text-6xl text-foreground/50'
              }, 'YN'))),
              React.createElement('div', {
                className: 'absolute inset-0 rounded-full border border-primary/20 scale-110 animate-pulse-glow'
              })
            ])),
            React.createElement(motion.div, {
              key: 'intro',
              className: 'max-w-xl text-center lg:text-left',
              initial: { opacity: 0, x: 50 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.6, delay: 0.2 }
            }, [
              React.createElement('h1', {
                key: 'title',
                className: 'font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-4'
              }, [
                React.createElement('span', { key: 'hello', className: 'text-foreground' }, "Hello, I'm"),
                React.createElement('br', { key: 'br' }),
                React.createElement('span', { key: 'name', className: 'text-gradient-gold' }, 'Your Name')
              ]),
              React.createElement('p', {
                key: 'desc1',
                className: 'text-muted-foreground text-lg md:text-xl leading-relaxed mb-6'
              }, 'A passionate developer and designer creating digital experiences that blend creativity with technology. I specialize in building beautiful, functional web applications that leave lasting impressions.'),
              React.createElement('p', {
                key: 'desc2',
                className: 'text-muted-foreground text-base leading-relaxed'
              }, "With over 5 years of experience in the industry, I've had the privilege of working with startups and established companies alike, turning ideas into reality through code and design.")
            ])
          ]),
          React.createElement('section', {
            key: 'skills-contact',
            className: 'min-h-screen flex flex-col lg:flex-row items-start justify-center px-6 py-20 gap-10 lg:gap-20 max-w-7xl mx-auto'
          }, [
            React.createElement(motion.div, {
              key: 'skills',
              className: 'flex-1 w-full',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6 }
            }, [
              React.createElement('h2', {
                key: 'title',
                className: 'font-display text-2xl md:text-3xl text-foreground mb-8 tracking-wide'
              }, [
                'Skills & ',
                React.createElement('span', { key: 'span', className: 'text-primary' }, 'Expertise')
              ]),
              React.createElement('div', {
                key: 'grid',
                className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
              }, skills.map((skillGroup, index) =>
                React.createElement(motion.div, {
                  key: skillGroup.category,
                  className: 'bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50',
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: index * 0.1 }
                }, [
                  React.createElement('h3', {
                    key: 'cat',
                    className: 'font-display text-lg text-accent mb-4 tracking-wider'
                  }, skillGroup.category),
                  React.createElement('div', {
                    key: 'items',
                    className: 'flex flex-wrap gap-2'
                  }, skillGroup.items.map((skill) =>
                    React.createElement('span', {
                      key: skill,
                      className: 'px-3 py-1 text-sm bg-muted/50 rounded-full text-foreground/80 border border-border/30'
                    }, skill)
                  ))
                ])
              ))
            ]),
            React.createElement(motion.div, {
              key: 'contact',
              className: 'flex-1 w-full lg:max-w-md',
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.2 }
            }, [
              React.createElement('h2', {
                key: 'title',
                className: 'font-display text-2xl md:text-3xl text-foreground mb-8 tracking-wide'
              }, [
                'Get in ',
                React.createElement('span', { key: 'span', className: 'text-primary' }, 'Touch')
              ]),
              React.createElement('div', {
                key: 'card',
                className: 'bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50'
              }, [
                React.createElement('p', {
                  key: 'desc',
                  className: 'text-muted-foreground mb-8 leading-relaxed'
                }, "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!"),
                React.createElement('div', {
                  key: 'social',
                  className: 'flex flex-wrap gap-4 mb-8'
                }, socialLinks.map((link) =>
                  React.createElement('a', {
                    key: link.name,
                    href: link.href,
                    className: 'p-3 rounded-full bg-muted/50 hover:bg-primary/20 hover:border-primary border border-border/50 transition-all group',
                    title: link.name
                  }, React.createElement(IconComponent, {
                    name: link.icon,
                    className: 'w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors'
                  }))
                )),
                React.createElement(Button, {
                  key: 'cta',
                  variant: 'cosmos',
                  size: 'lg',
                  className: 'w-full',
                  asChild: true
                }, React.createElement('a', {
                  href: 'mailto:hello@example.com'
                }, [
                  React.createElement(IconComponent, { key: 'icon', name: 'Mail', className: 'w-4 h-4 mr-2' }),
                  'Send me a message'
                ]))
              ]),
              React.createElement(motion.div, {
                key: 'back',
                className: 'mt-8 text-center',
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true },
                transition: { delay: 0.4 }
              }, React.createElement(Button, {
                variant: 'cosmosOutline',
                onClick: () => navigate('/universe')
              }, [
                React.createElement(IconComponent, { key: 'icon', name: 'ArrowLeft', className: 'w-4 h-4 mr-2' }),
                'Back to Universe'
              ]))
            ])
          ])
        ])
      ]);
}

// Universe Page
function Universe() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
      const [isDragging, setIsDragging] = useState(false);
      const [startX, setStartX] = useState(0);
      const [scrollLeft, setScrollLeft] = useState(0);
      const [scrollOffset, setScrollOffset] = useState(0);
      const [selectedProject, setSelectedProject] = useState(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [showInstructions, setShowInstructions] = useState(true);

  const baseProjects = [
        {
          id: 'phoenix',
          name: 'Phoenix',
          title: 'Campus-Rush',
          description: '“Campus Rush” is a captivating  interactive comic that talks about NYUAD students’ real experiences of how to use a 10 minute break in between classes effectively. As a web designer, I designed the website using the cava as well as made the storyline so that not only NYUAD students but also all the students in the world can resonate with it.',
          image: 'assets/constellation-phoenix.png',
          constellationImage: 'assets/constellation-phoenix.png',
          link: '#',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Canva'],
          position: { x: 200, y: 150 },
        },
        {
          id: 'unicorn',
          name: 'Unicorn',
          title: 'Shota\'s Productive Daily Routine',
          description: 'This is a website about my productive daily routine, teaching my audience how to spend a day productively. I used html, CSS, and Javascript to create this website, and used canva to create the wireframe.',
          image: 'assets/constellation-unicorn.png',
          constellationImage: 'assets/constellation-unicorn.png',
          link: '#',
          technologies: ['HTML', 'CSS', 'JavaScript'],
          position: { x: 700, y: 80 },
        },
        {
          id: 'wolf',
          name: 'Wolf',
          title: 'Laundry Adventure',
          description: '“Laundry Adventure” is an interactive short film that highlights real experiences students face in the laundry room, such as people removing clothes before they’re finished or even stealing items. I played the main character, whose favorite socks get stolen by someone. As the executive web developer, I created an interactive website where users can explore different pathways to learn how they should respond in situations where their clothes are taken.',
          image: 'assets/constellation-wolf.png',
          constellationImage: 'assets/constellation-wolf.png',
          link: '#',
          technologies: ['HTML', 'CSS', 'JavaScript'],
          position: { x: 1200, y: 180 },
        },
        {
          id: 'dragon',
          name: 'Dragon',
          title: 'Sound Detective',
          description: '“Sound Detective” is an interactive website where users restore music to a silent world by identifying instruments in distorted audio tracks after a global phenomenon called the “Great Sound Distortion” has erased all sound. As an executive web developer, I created an interactive, creepy website using HTML, CSS, and JS to effectively talk about the story. As a sound recorder, I used multiple professional sound equipment to record various instruments.',
          image: 'assets/constellation-dragon.png',
          constellationImage: 'assets/constellation-dragon.png',
          link: '#',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Sound Equipment'],
          position: { x: 1700, y: 100 },
        },
        {
          id: 'owl',
          name: 'Owl',
          title: 'Brainlot',
          description: 'BrainLot is a mobile learning app that infinitely generates MCQs from images or text input using AI and delivers them in a TikTok-style, infinite scrolling experience. I built the full end-to-end system, integrating local LLMs (llama.rn) and cloud models (Groq), implementing secure subscription verification with Supabase Edge Functions and RevenueCat, and designing a scalable backend with RLS, RPC functions, rate-limits, and upload controls. I also developed the React Native frontend, created the AI-powered MCQ generation pipeline with OCR and text chunking, and implemented secure authentication, purchase validation, and data-access enforcement.',
          image: 'assets/constellation-owl.png',
          constellationImage: 'assets/constellation-owl.png',
          link: '#',
          technologies: ['React Native', 'TypeScript', 'Supabase (Auth, Database, RLS)', 'Backend with Deno Edge Functions', 'PostgreSQL', 'RevenueCat', 'AI integration (Groq, Local LLMs)', 'OCR pipelines (Google ML Kit)'],
          position: { x: 2200, y: 150 },
        },
        {
          id: 'bear',
          name: 'Bear',
          title: 'ZEN EYE Pro',
          description: 'ZEN EYE Pro is a VR-based eye-tracking system that measures mental fatigue in just one minute by analyzing gaze patterns and blink behaviors in realistic environments, demonstrating strong ecological validity and objective accuracy. I built the system as the lead VR engineer and data scientist—programming the full Unity eye-tracking pipeline, creating real-time analytics tools, and developing the machine-learning models that processed gaze and blink data from over 2,000 participants. This work led to a validated fatigue assessment formula, 30% accuracy improvement, $163K in funding, and recognition as a Real Madrid Next Accelerator finalist, Startup World Cup top-10 finalist, and coverage on NIKKEI TV.',
          image: 'assets/constellation-bear.png',
          constellationImage: 'assets/constellation-bear.png',
          link: '#',
          technologies: ['Python', 'C#', 'C++', 'Unity', 'Unreal Engine', 'Blender', 'PICO enterprise (VR)'],
          position: { x: 2700, y: 200 },
        },
        {
          id: 'deer',
          name: 'Deer',
          title: 'Nature Photography',
          description: 'A stunning photography portfolio and marketplace for nature photographers. Features high-resolution image galleries, print ordering, and licensing management.',
          image: 'assets/constellation-deer.png',
          constellationImage: 'assets/constellation-deer.png',
          link: '#',
          technologies: ['Gatsby', 'Cloudinary', 'Stripe', 'Sanity'],
          position: { x: 3200, y: 120 },
        },
        {
          id: 'butterfly',
          name: 'Butterfly',
          title: 'Social Impact App',
          description: 'A platform connecting volunteers with local nonprofit organizations. Features event management, impact tracking, and community building tools for social good.',
          image: 'assets/constellation-butterfly.png',
          constellationImage: 'assets/constellation-butterfly.png',
          link: '#',
          technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
          position: { x: 3700, y: 160 },
        },
      ];

  const SECTION_WIDTH = 4200;
  const totalWidth = SECTION_WIDTH * 3;

  const allProjects = [
        ...baseProjects.map((p) => ({
          ...p,
          id: `${p.id}-clone-before`,
          position: { x: p.position.x, y: p.position.y },
        })),
        ...baseProjects.map((p) => ({
          ...p,
          position: { x: p.position.x + SECTION_WIDTH, y: p.position.y },
        })),
        ...baseProjects.map((p) => ({
          ...p,
          id: `${p.id}-clone-after`,
          position: { x: p.position.x + SECTION_WIDTH * 2, y: p.position.y },
        })),
      ];

      useEffect(() => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = SECTION_WIDTH;
        }
      }, []);

      useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
        return () => clearTimeout(timer);
      }, []);

  const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollLeft;
        setScrollOffset(scrollPos);
        if (isDragging) return;
        if (scrollPos >= SECTION_WIDTH * 2) {
          containerRef.current.scrollLeft = scrollPos - SECTION_WIDTH;
        } else if (scrollPos <= 0) {
          containerRef.current.scrollLeft = scrollPos + SECTION_WIDTH;
        }
      }, [isDragging]);

  const handleScrollEnd = useCallback(() => {
        if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollLeft;
        if (scrollPos >= SECTION_WIDTH * 2 - 100) {
          containerRef.current.scrollLeft = SECTION_WIDTH + (scrollPos - SECTION_WIDTH * 2);
        } else if (scrollPos <= 100) {
          containerRef.current.scrollLeft = SECTION_WIDTH * 2 - (100 - scrollPos);
        }
      }, []);

  const handleMouseDown = (e) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
      };

  const handleMouseUp = () => {
        setIsDragging(false);
        handleScrollEnd();
      };

  const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    const newScrollLeft = scrollLeft - walk;
        containerRef.current.scrollLeft = newScrollLeft;
    const scrollPos = containerRef.current.scrollLeft;
        if (scrollPos >= SECTION_WIDTH * 2) {
          containerRef.current.scrollLeft = scrollPos - SECTION_WIDTH;
          setScrollLeft(containerRef.current.scrollLeft + walk);
          setStartX(x);
        } else if (scrollPos <= 0) {
          containerRef.current.scrollLeft = scrollPos + SECTION_WIDTH;
          setScrollLeft(containerRef.current.scrollLeft + walk);
          setStartX(x);
        }
      };

  const handleTouchStart = (e) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
      };

  const handleTouchMove = (e) => {
        if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    const newScrollLeft = scrollLeft - walk;
        containerRef.current.scrollLeft = newScrollLeft;
    const scrollPos = containerRef.current.scrollLeft;
        if (scrollPos >= SECTION_WIDTH * 2) {
          containerRef.current.scrollLeft = scrollPos - SECTION_WIDTH;
          setScrollLeft(containerRef.current.scrollLeft + walk);
          setStartX(x);
        } else if (scrollPos <= 0) {
          containerRef.current.scrollLeft = scrollPos + SECTION_WIDTH;
          setScrollLeft(containerRef.current.scrollLeft + walk);
          setStartX(x);
        }
      };

  const handleTouchEnd = () => {
        setIsDragging(false);
        handleScrollEnd();
      };

  const scrollTo = (direction) => {
        if (!containerRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        setTimeout(handleScrollEnd, 350);
      };

  const handleConstellationClick = (project) => {
    const originalId = project.id.replace('-clone-before', '').replace('-clone-after', '');
    const originalProject = baseProjects.find(p => p.id === originalId) || project;
        setSelectedProject(originalProject);
        setIsModalOpen(true);
      };

  const IconComponent = ({ name, className }) => {
    const icons = {
          ArrowLeft: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M10 19l-7-7m0 0l7-7m-7 7h18' })
          ),
          Menu: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M4 6h16M4 12h16M4 18h16' })
          ),
          ChevronLeft: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M15 19l-7-7 7-7' })
          ),
          ChevronRight: React.createElement('svg', { className, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 5l7 7-7 7' })
          ),
        };
        return icons[name] || null;
      };

      return React.createElement('div', { className: 'relative min-h-screen overflow-hidden' }, [
        React.createElement(StarField, { key: 'stars', starCount: 800, parallaxOffset: scrollOffset }),
        React.createElement(motion.button, {
          key: 'back-btn',
          className: 'fixed top-6 left-6 z-40 p-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all',
          onClick: () => navigate('/'),
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.3 }
        }, React.createElement(IconComponent, { name: 'ArrowLeft', className: 'w-6 h-6 text-foreground' })),
        React.createElement(motion.button, {
          key: 'menu-btn',
          className: 'fixed top-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all font-display tracking-wider text-foreground',
          onClick: () => setIsMenuOpen(true),
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.3 }
        }, [
          React.createElement(IconComponent, { key: 'icon', name: 'Menu', className: 'w-5 h-5' }),
          React.createElement('span', { key: 'text', className: 'hidden md:inline' }, 'Menu')
        ]),
        showInstructions && React.createElement(motion.div, {
          key: 'instructions',
          className: 'fixed inset-0 z-30 flex items-center justify-center pointer-events-none',
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        }, React.createElement('div', {
          className: 'text-center text-foreground/80'
        }, [
          React.createElement('div', {
            key: 'icons',
            className: 'flex items-center justify-center gap-4 mb-4'
          }, [
            React.createElement(IconComponent, { key: 'left', name: 'ChevronLeft', className: 'w-6 h-6' }),
            React.createElement('div', { key: 'dot', className: 'w-4 h-4 rounded-full bg-foreground/50' }),
            React.createElement(IconComponent, { key: 'right', name: 'ChevronRight', className: 'w-6 h-6' })
          ]),
          React.createElement('p', { key: 'p1', className: 'text-lg font-body' }, 'Click and drag or Swipe horizontally to explore my universe.'),
          React.createElement('p', { key: 'p2', className: 'text-muted-foreground mt-2' }, 'Each constellation represents my project.'),
          React.createElement('p', { key: 'p3', className: 'text-muted-foreground' }, 'My universe loops infinitely, so keep exploring!')
        ])),
        React.createElement(motion.button, {
          key: 'scroll-left',
          className: 'fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-all',
          onClick: () => scrollTo('left'),
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.5 }
        }, React.createElement(IconComponent, { name: 'ChevronLeft', className: 'w-8 h-8 text-foreground' })),
        React.createElement(motion.button, {
          key: 'scroll-right',
          className: 'fixed right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-all',
          onClick: () => scrollTo('right'),
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.5 }
        }, React.createElement(IconComponent, { name: 'ChevronRight', className: 'w-8 h-8 text-foreground' })),
        React.createElement('div', {
          key: 'container',
          ref: containerRef,
          className: `relative h-screen overflow-x-auto overflow-y-hidden hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`,
          onMouseDown: handleMouseDown,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseUp,
          onMouseMove: handleMouseMove,
          onTouchStart: handleTouchStart,
          onTouchEnd: handleTouchEnd,
          onTouchMove: handleTouchMove,
          onScroll: handleScroll
        }, React.createElement('div', {
          className: 'relative h-full',
          style: { width: `${totalWidth}px`, minHeight: '100vh' }
        }, allProjects.map((project) =>
          React.createElement(Constellation, {
            key: project.id,
            id: project.id,
            name: project.name,
            image: resolveAssetPath(project.constellationImage),
            position: project.position,
            onClick: () => handleConstellationClick(project)
          })
        ))),
        React.createElement(ConstellationModal, {
          key: 'modal',
          project: selectedProject,
          isOpen: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }
        }),
        React.createElement(MenuOverlay, {
          key: 'menu',
          isOpen: isMenuOpen,
          onClose: () => setIsMenuOpen(false)
        }),
        React.createElement(motion.div, {
          key: 'logo',
          className: 'fixed bottom-6 left-6 z-30',
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 }
        }, React.createElement('span', {
          className: 'font-display text-lg tracking-wider text-foreground/70'
        }, [
          'MY',
          React.createElement('span', { key: 'span', className: 'text-primary' }, 'UNIVERSE')
        ]))
      ]);
}

// NotFound Page
function NotFound() {
  const location = useLocation();

      useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
      }, [location.pathname]);

      return React.createElement('div', {
        className: 'flex min-h-screen items-center justify-center bg-muted'
      }, React.createElement('div', {
        className: 'text-center'
      }, [
        React.createElement('h1', { key: 'title', className: 'mb-4 text-4xl font-bold' }, '404'),
        React.createElement('p', { key: 'desc', className: 'mb-4 text-xl text-muted-foreground' }, 'Oops! Page not found'),
        React.createElement('a', {
          key: 'link',
          href: '/',
          className: 'text-primary underline hover:text-primary/90'
        }, 'Return to Home')
      ]));
}

// App Component
function App() {
      return React.createElement(BrowserRouter, { basename: '/astro-portfolio-view/' }, React.createElement(Routes, {}, [
        React.createElement(Route, { key: '/', path: '/', element: React.createElement(Index) }),
        React.createElement(Route, { key: '/universe', path: '/universe', element: React.createElement(Universe) }),
        React.createElement(Route, { key: '/who', path: '/who', element: React.createElement(Who) }),
        React.createElement(Route, { key: '*', path: '*', element: React.createElement(NotFound) })
      ]));
}

// Render the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
} else {
  console.error('Root element not found');
}
