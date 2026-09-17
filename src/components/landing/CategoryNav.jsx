import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const categories = [
  { label: "Grundkurs", href: "#kurser" },
  { label: "Premiummoduler", href: "#premiummoduler" },
  { label: "Specialistkurser", href: "#specialistkurser" },
  { label: "Maskinutbildning", href: "#maskinutbildning" },
  { label: "Pedagogik", href: "#pedagogik" },
  { label: "Om oss", href: "#om-oss" },
];

export default function CategoryNav() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navHref = (anchor) => (isHome ? anchor : `/${anchor}`);

  return (
    <section className="py-14 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3"
        >
          Vad vill du lära dig idag?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-tight mb-8"
        >
          Hitta rätt utbildning för din roll
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={navHref(cat.href)}
              className="px-5 py-2.5 rounded-full bg-card border border-border/60 text-sm font-body font-medium text-foreground/80 hover:border-accent hover:text-accent transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}