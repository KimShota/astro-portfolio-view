import { motion } from 'framer-motion';

interface ConstellationProps {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number };
  onClick: () => void;
}

const Constellation = ({ name, image, position, onClick }: ConstellationProps) => {
  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {/* Glow effect behind */}
      <div className="absolute inset-0 blur-2xl bg-accent/20 rounded-full scale-75 group-hover:scale-100 group-hover:bg-accent/30 transition-all duration-500" />
      
      {/* Constellation image */}
      <motion.img
        src={image}
        alt={name}
        className="relative w-48 h-48 md:w-64 md:h-64 object-contain constellation-glow transition-all duration-300 group-hover:brightness-125"
        draggable={false}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Name label */}
      <motion.div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="font-display text-sm md:text-base text-foreground/80 tracking-widest uppercase group-hover:text-primary transition-colors duration-300">
          {name}
        </span>
      </motion.div>

      {/* Click indicator */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-primary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/40">
          <span className="text-primary text-xs font-display tracking-wider">Click to view</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Constellation;
