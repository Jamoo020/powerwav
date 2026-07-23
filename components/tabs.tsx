"use client";

import { motion } from "framer-motion";

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
        >
          {activeTab === tab.id ? (
            <motion.div layoutId="activeTab" className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-lg" transition={{ type: "spring", damping: 25, stiffness: 200 }} />
          ) : null}
          <span className={`relative z-10 ${activeTab === tab.id ? "text-[var(--color-primary)] font-semibold" : "text-slate-600 hover:text-slate-900"}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
