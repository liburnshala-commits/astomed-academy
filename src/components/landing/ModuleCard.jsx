import React from "react";
import { motion } from "framer-motion";
import { Clock, FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function ModuleCard({ module, index }) {
  const statusLabels = {
    draft: "Under utveckling",
    script_ready: "Manus klart",
    recorded: "Inspelad",
    editing: "I redigering",
    published: "Tillgänglig",
  };

  const isAvailable = module.status === "published";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/modul/${module.id}`} className="group block">
        <div className="relative bg-card border border-border/50 p-6 md:p-8 hover:border-accent/40 hover:shadow-md transition-all duration-200" style={{borderRadius: "4px"}}>
          {/* Module number */}
          <div className="absolute top-6 right-8 md:top-8">
            <span className="font-heading text-5xl font-bold text-muted/60 select-none tabular-nums">
              {String(module.module_number).padStart(2, "0")}
            </span>
          </div>

          <div className="relative">
            <span className={`inline-block text-[10px] font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm ${isAvailable ? "bg-accent text-white" : "bg-muted text-muted-foreground"}`}>
              {statusLabels[module.status] || "Under utveckling"}
            </span>

            <h3 className="mt-4 font-heading text-lg md:text-xl font-semibold text-foreground leading-snug pr-16 group-hover:text-accent transition-colors duration-200">
              {module.title}
            </h3>

            <p className="mt-2 text-sm font-body text-muted-foreground leading-relaxed line-clamp-2">
              {module.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
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

              {module.price && (
                <span className="font-heading text-lg font-semibold text-foreground">
                  {module.price} <span className="text-sm font-body font-normal text-muted-foreground">kr</span>
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-body font-semibold uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Läs mer <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}