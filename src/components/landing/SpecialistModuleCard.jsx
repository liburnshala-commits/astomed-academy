import React from "react";
import { motion } from "framer-motion";
import { Clock, FileText, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function SpecialistModuleCard({ module, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="h-full"
    >
      <Link to={`/modul/${module.id}`} className="group block h-full">
        <div className="bg-card border border-accent/30 p-8 flex flex-col gap-4 hover:border-accent hover:shadow-md transition-all duration-200 h-full" style={{ borderRadius: "4px" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-accent text-white mb-1">
                Tillgänglig nu
              </span>
              <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">{module.title}</h3>
            </div>
          </div>
          <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-3">{module.description}</p>
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex items-center gap-5 text-xs font-body text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent/70" />
                {module.duration_minutes || 15} min
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-accent/70" />
                PDF inkl.
              </span>
            </div>
            <span className="font-heading text-lg font-semibold text-foreground">
              {module.price} <span className="text-sm font-body font-normal text-muted-foreground">kr</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body font-semibold uppercase tracking-wider text-accent">
            Till modulen <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}