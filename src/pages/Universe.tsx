import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import StarField from '@/components/StarField';
import Constellation from '@/components/Constellation';
import ConstellationModal from '@/components/ConstellationModal';
import MenuOverlay from '@/components/MenuOverlay';
import { Button } from '@/components/ui/button';

// Import constellation images
import phoenixImg from '@/assets/constellation-phoenix.png';
import unicornImg from '@/assets/constellation-unicorn.png';
import wolfImg from '@/assets/constellation-wolf.png';
import dragonImg from '@/assets/constellation-dragon.png';

interface Project {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  constellationImage: string;
  link: string;
  technologies: string[];
  position: { x: number; y: number };
}

const projects: Project[] = [
  {
    id: 'phoenix',
    name: 'Phoenix',
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce solution built with cutting-edge technologies. Features include real-time inventory management, seamless checkout experience, and responsive design that works beautifully across all devices.',
    image: phoenixImg,
    constellationImage: phoenixImg,
    link: '#',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    position: { x: 200, y: 150 },
  },
  {
    id: 'unicorn',
    name: 'Unicorn',
    title: 'Creative Portfolio',
    description: 'An immersive portfolio experience showcasing creative works through interactive animations and stunning visuals. Built with performance in mind while maintaining artistic expression.',
    image: unicornImg,
    constellationImage: unicornImg,
    link: '#',
    technologies: ['Next.js', 'Framer Motion', 'Three.js', 'Tailwind'],
    position: { x: 700, y: 100 },
  },
  {
    id: 'wolf',
    name: 'Wolf',
    title: 'Analytics Dashboard',
    description: 'A comprehensive analytics platform that transforms complex data into actionable insights. Features real-time data visualization, custom reporting, and intuitive user interface.',
    image: wolfImg,
    constellationImage: wolfImg,
    link: '#',
    technologies: ['Vue.js', 'D3.js', 'Python', 'AWS'],
    position: { x: 1200, y: 200 },
  },
  {
    id: 'dragon',
    name: 'Dragon',
    title: 'Mobile Application',
    description: 'A cross-platform mobile application designed for seamless user experience. Incorporates native features while maintaining consistent design language across iOS and Android.',
    image: dragonImg,
    constellationImage: dragonImg,
    link: '#',
    technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
    position: { x: 1700, y: 120 },
  },
];

const Universe = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const universeWidth = 2200;

  useEffect(() => {
    const timer = setTimeout(() => setShowInstructions(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleConstellationClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <StarField starCount={300} />

      {/* Back button */}
      <motion.button
        className="fixed top-6 left-6 z-40 p-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </motion.button>

      {/* Menu button */}
      <motion.button
        className="fixed top-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full border-2 border-foreground/50 hover:border-foreground hover:bg-foreground/10 transition-all font-display tracking-wider text-foreground"
        onClick={() => setIsMenuOpen(true)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Menu className="w-5 h-5" />
        <span className="hidden md:inline">Menu</span>
      </motion.button>

      {/* Instructions overlay */}
      {showInstructions && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center text-foreground/80">
            <div className="flex items-center justify-center gap-4 mb-4">
              <ChevronLeft className="w-6 h-6" />
              <div className="w-4 h-4 rounded-full bg-foreground/50" />
              <ChevronRight className="w-6 h-6" />
            </div>
            <p className="text-lg font-body">Click and drag to explore the universe.</p>
            <p className="text-muted-foreground mt-2">Each constellation holds a different project.</p>
            <p className="text-muted-foreground">Click the constellations to discover more.</p>
          </div>
        </motion.div>
      )}

      {/* Scroll arrows */}
      <motion.button
        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-all"
        onClick={() => scrollTo('left')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChevronLeft className="w-8 h-8 text-foreground" />
      </motion.button>

      <motion.button
        className="fixed right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-muted/30 hover:bg-muted/50 transition-all"
        onClick={() => scrollTo('right')}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChevronRight className="w-8 h-8 text-foreground" />
      </motion.button>

      {/* Draggable universe container */}
      <div
        ref={containerRef}
        className={`relative h-screen overflow-x-auto overflow-y-hidden hide-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        <div
          className="relative h-full"
          style={{ width: `${universeWidth}px`, minHeight: '100vh' }}
        >
          {/* Constellations */}
          {projects.map((project) => (
            <Constellation
              key={project.id}
              id={project.id}
              name={project.name}
              image={project.constellationImage}
              position={project.position}
              onClick={() => handleConstellationClick(project)}
            />
          ))}
        </div>
      </div>

      {/* Project modal */}
      <ConstellationModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />

      {/* Menu overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Logo/Brand */}
      <motion.div
        className="fixed bottom-6 left-6 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="font-display text-lg tracking-wider text-foreground/70">
          MY<span className="text-primary">UNIVERSE</span>
        </span>
      </motion.div>
    </div>
  );
};

export default Universe;
