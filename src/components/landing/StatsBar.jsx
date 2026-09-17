import React from "react";
import { motion } from "framer-motion";
import { Clock, Layers, Target, Award } from "lucide-react";

const stats = [
  { icon: Clock, value: "15 min", label: "Per modul" },
  { icon: Layers, value: "10", label: "Repetitionskort / modul" },
  { icon: Target, value: "80%", label: "Godkänd gräns" },
  { icon: Award, value: "1", label: "Certifikat per modul" },
];

export default function StatsBar() {
  return (
    <section className="bg-primary text-primary-foreground border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center md:border-r border-white/10 last:border-r-0 md:px-4"
              >
                <Icon className="w-5 h-5 text-accent mx-auto mb-3" />
                <p className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm font-body text-white/60 mt-1.5">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}