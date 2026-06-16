import { ReactNode } from "react";
import { motion } from "framer-motion";
import Container from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "white" | "gray" | "gradient" | "transparent";
  animated?: boolean;
}

const Section = ({
  children,
  className = "",
  containerSize = "xl",
  padding = "lg",
  background = "transparent",
  animated = false,
}: SectionProps) => {
  const paddingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-24",
    xl: "py-24 sm:py-32",
  };

  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    gradient: "bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50",
    transparent: "bg-transparent",
  };

  const sectionClasses = `${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`;

  if (animated) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={sectionClasses}
      >
        <Container size={containerSize}>{children}</Container>
      </motion.section>
    );
  }

  return (
    <section className={sectionClasses}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
};

export default Section;
