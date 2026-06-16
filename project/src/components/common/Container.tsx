import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
  animated?: boolean;
}

const Container = ({
  children,
  className = "",
  size = "xl",
  padding = true,
  animated = false,
}: ContainerProps) => {
  const maxWidths = {
    sm: "max-w-screen-sm",   // 640px
    md: "max-w-screen-md",   // 768px
    lg: "max-w-screen-lg",   // 1024px
    xl: "max-w-7xl",         // 1280px
    "2xl": "max-w-screen-2xl", // 1536px
    full: "max-w-full",
  };

  const paddingClasses = padding ? "px-4 sm:px-6 lg:px-8" : "";

  const containerClasses = `${maxWidths[size]} mx-auto ${paddingClasses} ${className}`;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={containerClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={containerClasses}>{children}</div>;
};

export default Container;
