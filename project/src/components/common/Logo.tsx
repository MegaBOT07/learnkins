import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const Logo = ({ className = "", size = "md", animated = false }: LogoProps) => {
  const sizes = {
    sm: { width: 120, height: 36 },
    md: { width: 160, height: 48 },
    lg: { width: 200, height: 60 },
    xl: { width: 240, height: 72 },
  };

  const { width, height } = sizes[size];

  const LogoSVG = () => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Graduation Cap Icon */}
      <g>
        {/* Cap Base */}
        <motion.path
          d="M30 18L15 24L30 30L45 24L30 18Z"
          fill="#0ea5e9"
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        {/* Cap Top */}
        <motion.path
          d="M30 12L30 18L45 24L45 18L30 12Z"
          fill="#0284c7"
          initial={animated ? { y: -10, opacity: 0 } : {}}
          animate={animated ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Tassel */}
        <motion.circle
          cx="30"
          cy="10"
          r="2"
          fill="#f97316"
          initial={animated ? { scale: 0 } : {}}
          animate={animated ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
        <motion.line
          x1="30"
          y1="10"
          x2="30"
          y2="16"
          stroke="#f97316"
          strokeWidth="1.5"
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
        {/* Book */}
        <motion.rect
          x="22"
          y="26"
          width="16"
          height="12"
          rx="1"
          fill="#a855f7"
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
        <motion.line
          x1="30"
          y1="26"
          x2="30"
          y2="38"
          stroke="white"
          strokeWidth="1"
          opacity="0.5"
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
      </g>

      {/* Text */}
      <motion.text
        x="60"
        y="35"
        fontFamily="Poppins, sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="#0c4a6e"
        initial={animated ? { opacity: 0, x: -20 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Learn
      </motion.text>
      <motion.text
        x="130"
        y="35"
        fontFamily="Poppins, sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="#0ea5e9"
        initial={animated ? { opacity: 0, x: 20 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Kins
      </motion.text>

      {/* Tagline */}
      <motion.text
        x="60"
        y="48"
        fontFamily="Inter, sans-serif"
        fontSize="8"
        fontWeight="500"
        fill="#64748b"
        letterSpacing="1.5"
        initial={animated ? { opacity: 0 } : {}}
        animate={animated ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        LEARN • GROW • EXCEL
      </motion.text>
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LogoSVG />
      </motion.div>
    );
  }

  return <LogoSVG />;
};

export default Logo;
