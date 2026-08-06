import React from "react";
import { motion } from "framer-motion";
import {
  Brain, Layers, Repeat, Target, Sparkles, TrendingUp,
  CheckCircle, RotateCw, Award
} from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "AI skapar innehållet",
    description: "Vår AI läser modulens juridiska innehåll och genererar automatiskt 10 repetitionskort och en kunskapskontroll anpassad efter de viktigaste punkterna.",
    color: "text-accent",
  },
  {
    icon: Layers,
    title: "Active Recall",
    description: "Du studerar med vändbara kort: frågan tvingar dig att aktivt hämta svaret ur minnet — den mest bevisat effektiva inlärningsmetoden enligt kognitiv forskning.",
    color: "text-accent",
  },
  {
    icon: Repeat,
    title: "Spaced Repetition",
    description: "Kort du markerar som \"behöver öva\" återkommer i nästa studierunda. Repetitionen sker med växande intervaller så kunskapen fäster långsiktigt.",
    color: "text-accent",
  },
  {
    icon: Target,
    title: "Kunskapskontroll",
    description: "Efter repetitionen gör du ett quiz med flervalsfrågor och pedagogiska förklaringar. Du behöver 80 % rätt för att bli godkänd och låsa upp nästa modul.",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    title: "Uppföljning & anpassning",
    description: "Systemet sparar vilka kort och frågor du behärskar. Din studiegång anpassas automatiskt — mer tid på det som är svårt, mindre på det du redan kan.",
    color: "text-accent",
  },
  {
    icon: Award,
    title: "Certifikat",
    description: "När du godkänns genereras ett personligt certifikat automatiskt som bevis på din kunskap — sparat i din profil och redo att ladda ner.",
    color: "text-accent",
  },
];

const features = [
  { icon: Brain, label: "Kognitivt vetenskaplig metod" },
  { icon: Sparkles, label: "AI-genererat innehåll" },
  { icon: TrendingUp, label: "Individuell anpassning" },
  { icon: CheckCircle, label: "Mätbar progression" },
];

export default function PedagogySection() {
  return (
    <section id="pedagogik" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            <Brain className="w-3.5 h-3.5" />
            Vår pedagogik
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Inlärning som fastnar — bevisat effektivt
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Astomed Academy kombinerar kognitiv vetenskap med AI för att förvandla komplex
            lagstiftning till kunskap du faktiskt minner — inte bara läser och glömmer.
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm font-medium text-foreground/80"
            >
              <f.icon className="w-4 h-4 text-accent" />
              {f.label}
            </div>
          ))}
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground/60">
                  Steg {i + 1}
                </span>
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The learning loop diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 bg-card rounded-3xl border border-border/50 p-8 md:p-12"
        >
          <h3 className="font-heading text-xl font-semibold text-foreground text-center mb-2">
            Inlärningscykeln
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            Varje modul följer samma beprövade cykel — från repetition till certifikat.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {[
              { icon: Layers, label: "Studera kort", sub: "Active recall" },
              { icon: RotateCw, label: "Markera kunskap", sub: "Kan / Behöver öva" },
              { icon: Target, label: "Kunskapskontroll", sub: "Quiz med 80% krav" },
              { icon: Award, label: "Certifikat", sub: "Nästa modul låses upp" },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center w-32 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
                    <item.icon className="w-6 h-6 text-accent" />
                  </div>
                  <p className="font-heading text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block text-muted-foreground/40 text-2xl px-1">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}