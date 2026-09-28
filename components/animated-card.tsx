"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-primary)]/25 hover:shadow-[var(--shadow-card-hover)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
