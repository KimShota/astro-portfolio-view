import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface Project {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  link: string;
  technologies: string[];
}

interface ConstellationModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ConstellationModal = ({ project, isOpen, onClose }: ConstellationModalProps) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="relative w-full h-full max-w-6xl mx-auto bg-card/95 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Left side - Content */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="text-accent text-sm font-display tracking-widest uppercase">
                      {project.name} Constellation
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-2 mb-4 text-foreground">
                      {project.title}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-sm bg-muted rounded-full text-muted-foreground border border-border/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Link */}
                    <Button variant="cosmos" size="lg" asChild>
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </motion.div>
                </div>

                {/* Right side - Image */}
                <motion.div
                  className="flex-1 relative bg-muted/30"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/50" />
                </motion.div>
              </div>

              {/* Back button */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
                <Button variant="cosmosOutline" onClick={onClose}>
                  Back to Universe
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConstellationModal;
