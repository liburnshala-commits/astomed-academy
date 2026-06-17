import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ModuleCard from "./ModuleCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseSection() {
  const { data: modules, isLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
    initialData: [],
  });

  return (
    <section id="kurser" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">Grundkurs</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Från idé till startklar klinik
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            En helhetsbild av de viktigaste regelverken och rättsområdena — patientsäkerhet, journalföring, 
            dataskydd, hygien, marknadsföring och ledningssystem. Riktar sig till dig som planerar att starta 
            eller nyligen har etablerat en skönhetsklinik.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:gap-6">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))
          ) : modules.length > 0 ? (
            modules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Moduler laddas upp snart.</p>
              <p className="text-sm mt-2">Gå till Admin-panelen för att lägga till kurser och moduler.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}