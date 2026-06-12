import React from "react";
import { motion } from "framer-motion";
import { Scale, Video, Briefcase, Users } from "lucide-react";

const partners = [
  {
    name: "Medlaw",
    role: "Innehåll & Expertis",
    description: "Juridisk expertis, manusstruktur och extramaterial. Det tunga lagliga innehållet i tillgänglig form.",
    icon: Scale,
  },
  {
    name: "Astomed",
    role: "Plattform & Produktion",
    description: "Teknik, filmstudio, paketering, marknadsföring och försäljning. Allt det praktiska.",
    icon: Video,
  },
];

export default function AboutSection() {
  return (
    <section id="om-oss" className="py-20 md:py-32 bg-muted/40 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">Samarbete</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Astomed × Medlaw
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            Tung juridik i korta, lättsamma och klarspråkiga moduler. Vi sänker tröskeln för kliniker 
            att göra rätt från början.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border/50 p-8" style={{borderRadius: "4px"}}
            >
              <div className="w-10 h-10 rounded-sm bg-accent/10 flex items-center justify-center mb-5">
                <partner.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{partner.name}</h3>
              <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mt-1">{partner.role}</p>
              <p className="mt-3 text-sm font-body text-muted-foreground leading-relaxed">{partner.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Briefcase, value: "15 min", label: "Per modul" },
            { icon: Scale, value: "5", label: "Pilotmoduler" },
            { icon: Users, value: "2", label: "Expertpartners" },
            { icon: Video, value: "2025", label: "Lansering" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-card border border-border/50" style={{borderRadius: "4px"}}>
              <stat.icon className="w-4.5 h-4.5 text-accent mx-auto mb-3" />
              <p className="font-heading text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs font-body text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}