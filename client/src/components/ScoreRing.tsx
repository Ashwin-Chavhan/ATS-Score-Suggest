import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

export function ScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 10,
  animate = true
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  let strokeColor = "stroke-destructive"; // Red
  if (score >= 80) strokeColor = "stroke-emerald-500"; // Green
  else if (score >= 60) strokeColor = "stroke-amber-500"; // Yellow
  else if (score >= 40) strokeColor = "stroke-orange-500"; // Orange

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Track */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted fill-none"
        />
        {/* Animated Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`${strokeColor} fill-none drop-shadow-md`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      
      {/* Score Text inside */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-black text-foreground"
          initial={animate ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-medium text-muted-foreground mt-[-4px]">
          / 100
        </span>
      </div>
    </div>
  );
}
