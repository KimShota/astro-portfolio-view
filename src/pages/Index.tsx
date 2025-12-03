import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StarField from '@/components/StarField';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated starfield background */}
      <StarField starCount={250} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4">
            <span className="text-foreground">MY</span>
            <br />
            <span className="text-gradient-gold">UNIVERSE</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div
          className="max-w-2xl mx-auto mt-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Welcome to my creative universe. Each constellation represents a project, 
            a journey through design and development. Click and drag to explore the cosmos 
            of my work, and discover the stories behind each creation.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
        >
          <Button
            variant="cosmos"
            size="xl"
            onClick={() => navigate('/universe')}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Start Exploring My Universe</span>
            <motion.div
              className="absolute inset-0 bg-primary/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Button>
        </motion.div>

        {/* Floating elements decoration */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-2 text-muted-foreground/50 text-sm">
            <span className="w-4 h-[1px] bg-muted-foreground/50" />
            <span>Scroll down or click to begin</span>
            <span className="w-4 h-[1px] bg-muted-foreground/50" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
