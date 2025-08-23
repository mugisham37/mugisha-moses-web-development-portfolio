"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface SystemStatusProps {
  className?: string;
}

export default function SystemStatus({ className }: SystemStatusProps) {
  const statusItems = [
    { label: "Next.js 14 with App Router", status: "✅" },
    { label: "TypeScript strict configuration", status: "✅" },
    { label: "Tailwind CSS with custom brutalist theme", status: "✅" },
    { label: "Framer Motion for animations", status: "✅" },
    { label: "ESLint and Prettier configuration", status: "✅" },
    { label: "Performance optimizations", status: "✅" },
  ];

  return (
    <motion.div
      className={clsx(
        "p-6 border-8 border-black shadow-brutal bg-yellow-400",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold font-space-mono mb-4">SYSTEM STATUS</h2>
      <ul className="space-y-2 font-jetbrains-mono">
        {statusItems.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center"
          >
            <span className="mr-2">{item.status}</span>
            <span>{item.label}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
