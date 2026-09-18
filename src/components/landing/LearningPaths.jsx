import React from "react";
import { motion } from "framer-motion";
import { Building2, Stethoscope, Sparkles, Wrench, Users, ArrowRight } from "lucide-react";

const paths = [
  {
    id: "verksamhetsutovare",
    icon: Building2,
    title: "Verksamhetsutövare eller klinikägare",
    description:
      "Övergripande ansvar, ledningssystem, patientsäkerhet och myndighetskontakter — för dig som driver eller äger verksamheten.",
  },
  {
    id: "medicinskt-ansvarig",
    icon: Stethoscope,
    title: "Medicinskt ansvarig läkare",
    description:
      "Juridik kring medicinska beslut, journalföring, delegering, samtycke och det medicinska ledningsansvaret.",
  },
  {
    id: "behandlare",
    icon: Sparkles,
    title: "Behandlare",
    description:
      "Praktiska regler för säker behandling — hygien, samtycke, utrustningsanvändning och dokumentation i vardagen.",
  },
  {
    id: "teknisk-ansvarig",
    icon: Wrench,
    title: "Teknisk ansvarig",
    description:
      "Krav på medicinteknisk utrustning, service, kalibrering, leverans- och funktionskontroll samt egenkontroll.",
  },
  {
    id: "allman-personal",
    icon: Users,
    title: "Allmän personal",
    description:
      "Grundläggande rutiner, hygien, patientsäkerhet och serviceinriktat bemötande för hela klinikteamet.",
  },
];

export default function LearningPaths() {
  return (
    <section id="larstigar" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">
            Rollbaserade lärstigar
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Utbildning anpassad efter din roll
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            Astomed Academy strukturerar innehållet utifrån ditt ansvar i verksamheten. Välj din roll
            för att se vilka moduler som är mest relevanta för dig.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                id={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="scroll-mt-24 bg-card border border-border/50 rounded-xl p-7 flex flex-col hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground leading-snug">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm font-body text-muted-foreground leading-relaxed flex-1">
                  {p.description}
                </p>
                <a
                  href="#kurser"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-body font-semibold text-accent hover:gap-2.5 transition-all"
                >
                  Till modulerna
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}