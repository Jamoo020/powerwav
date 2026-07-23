"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Expandable({ title, children, className = "" }: ExpandableProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all ${isOpen ? "shadow-md" : "shadow-sm"} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} className="text-[var(--color-primary)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[var(--color-border)]"
          >
            <div className="px-6 py-4 text-slate-600">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
