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

  const statusStyles = {
    draft: "bg-muted text-muted-foreground",
    script_ready: "bg-accent/10 text-accent-foreground",
    recorded: "bg-accent/20 text-accent-foreground",
    editing: "bg-accent/30 text-accent-foreground",
    published: "bg-accent text-accent-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/modul/${module.id}`} className="group block">
        <div className="relative bg-card rounded-2xl border border-border/50 p-6 md:p-8 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
          {/* Module number */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8">
            <span className="font-heading text-5xl md:text-6xl font-bold text-muted/80 select-none">
              {String(module.module_number).padStart(2, "0")}
            </span>
          </div>

          <div className="relative">
            <Badge className={`${statusStyles[module.status] || statusStyles.draft} border-0 text-[10px] uppercase tracking-wider font-semibold`}>
              {statusLabels[module.status] || "Under utveckling"}
            </Badge>

            <h3 className="mt-4 font-heading text-xl md:text-2xl font-semibold text-foreground leading-snug pr-16 group-hover:text-accent transition-colors">
              {module.title}
            </h3>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {module.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {module.duration_minutes || 15} min
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  PDF inkl.
                </span>
              </div>

              {module.price && (
                <span className="text-lg font-semibold text-foreground">
                  {module.price} <span className="text-sm font-normal text-muted-foreground">kr</span>
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Läs mer <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}