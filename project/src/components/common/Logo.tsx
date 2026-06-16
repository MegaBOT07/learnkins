import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const Logo = ({ className = "", size = "md", animated = false }: LogoProps) => {
  const heights = {
    sm: "h-9",
    md: "h-12",
    lg: "h-16",
    xl: "h-20",
  };

  const img = (
    <img
      src="/erasebg-transformed.png"
      alt="LearnKins Logo"
      className={`${heights[size]} w-auto object-contain ${className}`}
    />
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {img}
      </motion.div>
    );
  }

  return img;
};

export default Logo;
