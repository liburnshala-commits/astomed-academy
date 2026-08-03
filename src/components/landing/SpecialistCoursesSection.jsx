import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Scale, Users, Megaphone, ClipboardCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpecialistModuleCard from "./SpecialistModuleCard";

const upcomingCourses = [
  {
    icon: Scale,
    title: "Arbetsrätt för kliniker",
    description: "Fördjupning i arbetsgivaransvar, anställningsavtal, sjukfrånvaro, uppsägning och arbetsrättsliga tvister — anpassad för klinikverksamhet.",
    price: "2 990–5 990 kr",
  },
  {
    icon: Users,
    title: "Konsumenträtt i praktiken",
    description: "Konsumentköplagen, reklamationsrätt, ångerrätt och hur tvister med patienter/kunder hanteras effektivt och i enlighet med lagen.",
    price: "2 990–5 990 kr",
  },
  {
    icon: Megaphone,
    title: "Marknadsföringsrätt",
    description: "Djupgående genomgång av marknadsföringslagen, Konsumentverkets praxis och hur ni bygger en marknadsföringsstrategi som håller juridiskt.",
    price: "2 990–5 990 kr",
  },
  {
    icon: ClipboardCheck,
    title: "Myndighetstillsyn",
    description: "Fullständig kurs om tillsyn från IVO, Läkemedelsverket och Strålsäkerhetsmyndigheten — hur ni förbereder er, hanterar inspektioner och åtgärdar brister.",
    price: "2 990–5 990 kr",
  },
];

export default function SpecialistCoursesSection() {
  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
  });

  const specialistModules = modules.filter(
    (m) => (m.category || "grundkurs") === "specialist" && m.status === "published"
  );

  return (
    <section id="specialistkurser" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">Specialistkurser</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Fördjupning inom<br />specifika rättsområden
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            Mer omfattande kurser för dig som vill ha en gedigen kompetens inom ett specifikt juridiskt område.
            Framtagna av specialistjurister med lång erfarenhet av klinikbranschen.
          </p>
        </motion.div>

        {/* Tillgängliga specialistmoduler */}
        {specialistModules.length > 0 && (
          <>
            <p className="mt-14 text-xs font-body font-semibold uppercase tracking-widest text-foreground/60 mb-4">Tillgängliga nu</p>
            <div className="grid gap-6 md:grid-cols-2">
              {specialistModules.map((module, i) => (
                <SpecialistModuleCard key={module.id} module={module} index={i} />
              ))}
            </div>
          </>
        )}

        {/* Kommande kurser */}
        <p className="mt-14 text-xs font-body font-semibold uppercase tracking-widest text-foreground/60 mb-4">Fler kurser under utveckling</p>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingCourses.map((course, i) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-xl p-8 flex flex-col gap-4 opacity-80"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 border border-border flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{course.title}</h3>
                    <p className="text-xs text-accent font-medium mt-0.5">{course.price}</p>
                  </div>
                </div>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">{course.description}</p>
                <div className="mt-auto pt-2">
                  <button className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
                    Anmäl intresse
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-muted/50 border border-border/50 rounded-xl p-8 text-center"
        >
          <GraduationCap className="w-10 h-10 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-foreground">Skräddarsydda utbildningar</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            Behöver ni en utbildning anpassad för er specifika verksamhet? Vi erbjuder även skräddarsydda
            kurser och workshops för klinikteam.
          </p>
          <a href="#kontakt" className="mt-6 inline-block">
            <Button variant="outline" size="sm" className="gap-2 mt-4">
              Kontakta oss
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}