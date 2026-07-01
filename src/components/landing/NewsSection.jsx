import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NewsSection() {
  const { data: modules = [] } = useQuery({
    queryKey: ["latest-modules"],
    queryFn: () => base44.entities.Module.list("-created_date", 3),
  });

  if (modules.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-foreground">
            Nyheter & senast tillagt
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {modules.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/modul/${module.id}`}
                className="block h-full bg-card border border-border/50 rounded-xl p-5 hover:border-accent/40 transition-colors group"
              >
                <span className="inline-block text-[10px] font-body font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded-sm mb-3">
                  {module.status === "published" ? "Tillgänglig" : "Kommer snart"}
                </span>
                <h3 className="font-heading font-semibold text-foreground leading-snug">
                  {module.title}
                </h3>
                {module.description && (
                  <p className="text-sm font-body text-muted-foreground mt-2 line-clamp-2">
                    {module.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-body font-medium text-accent mt-4 group-hover:gap-2 transition-all">
                  Läs mer <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}