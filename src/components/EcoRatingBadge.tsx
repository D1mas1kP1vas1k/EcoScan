import { motion } from 'motion/react';

interface EcoRatingBadgeProps {
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function EcoRatingBadge({ rating, size = 'md', showLabel = false }: EcoRatingBadgeProps) {
  const ratingStyles = {
    A: {
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-600',
      glow: 'shadow-green-500/50',
    },
    B: {
      gradient: 'from-lime-500 to-green-500',
      bg: 'bg-lime-500',
      glow: 'shadow-lime-500/50',
    },
    C: {
      gradient: 'from-yellow-400 to-orange-400',
      bg: 'bg-yellow-500',
      glow: 'shadow-yellow-500/50',
    },
    D: {
      gradient: 'from-orange-500 to-red-500',
      bg: 'bg-orange-500',
      glow: 'shadow-orange-500/50',
    },
    E: {
      gradient: 'from-red-600 to-red-700',
      bg: 'bg-red-600',
      glow: 'shadow-red-500/50',
    },
  };

  const sizes = {
    sm: { container: 'w-10 h-10', text: 'text-lg' },
    md: { container: 'w-14 h-14', text: 'text-2xl' },
    lg: { container: 'w-20 h-20', text: 'text-4xl' },
  };

  const style = ratingStyles[rating];
  const sizeStyle = sizes[size];

  // Fallback if rating is invalid
  if (!style) {
    console.warn(`Invalid rating: ${rating}. Using default 'C' rating.`);
    const defaultStyle = ratingStyles['C'];
    const defaultSizeStyle = sizes[size];
    
    return (
      <div className="flex items-center gap-3">
        <div className={`${defaultSizeStyle.container} rounded-full bg-gradient-to-br ${defaultStyle.gradient} shadow-lg ${defaultStyle.glow} flex items-center justify-center`}>
          <span className={`${defaultSizeStyle.text} text-white`}>C</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="relative"
      >
        <div 
          className={`${sizeStyle.container} rounded-full bg-gradient-to-br ${style.gradient} shadow-lg ${style.glow} flex items-center justify-center relative overflow-hidden`}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut"
            }}
          />
          <span className={`${sizeStyle.text} text-white relative z-10`}>
            {rating}
          </span>
        </div>
        
        {/* Pulse ring */}
        <motion.div
          className={`absolute inset-0 rounded-full ${style.bg} opacity-40`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.div>
      
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-500">Эко-рейтинг</p>
        </motion.div>
      )}
    </div>
  );
}