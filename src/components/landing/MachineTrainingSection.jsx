import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { PackageCheck, Settings2, ShieldCheck, Lock, ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const modulesConfig = [
  {
    title: "Leveranskontroll",
    icon: PackageCheck,
    description:
      "Steg-för-steg genomgång av hur du tar emot och kontrollerar din nya utrustning vid leverans — från emballage och identifikation till säkerhetsmärkning och dokumentation.",
    points: [
      "Kontroll av emballage och transportskador",
      "Identifikation mot leveransspecifikation",
      "Säkerhetsmärkning och varudeklaration",
      "Dokumentation och signering av protokoll",
    ],
  },
  {
    title: "Funktionskontroll",
    icon: Settings2,
    description:
      "Praktisk guide för att verifiera att maskinen fungerar korrekt innan den tas i bruk — inklusive kalibrering, säkerhetstest och prestandakontroll enligt tillverkarens specifikation.",
    points: [
      "Uppstart och kalibrering enligt manual",
      "Säkerhetstest och nödstoppsfunktion",
      "Prestandakontroll och inställningar",
      "Godkännande och dokumentation för bruk",
    ],
  },
];

export default function MachineTrainingSection() {
  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
  });

  const machineModules = modules.filter(
    (m) => m.category === "maskinutbildning" && m.status === "published"
  );

  return (
    <section id="maskinutbildning" className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">
            Maskinutbildning
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Leverans- och funktionskontroll
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            När du köper en maskin av oss får du tillgång till dessa öppna utbildningsmoduler.
            De guidar dig säkert genom mottagande och idrifttagning — så att din utrustning är
            redo för patientsäker användning från dag ett.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {modulesConfig.map((cfg, i) => {
            const Icon = cfg.icon;
            const module = machineModules.find((m) => m.title === cfg.title);
            return (
              <motion.div
                key={cfg.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border/50 p-8 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">{cfg.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Öppen utbildning vid maskininköp
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{cfg.description}</p>

                <ul className="space-y-2 mb-6">
                  {cfg.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  {module ? (
                    <Link to={`/modul/${module.id}`}>
                      <button className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                        <PlayCircle className="w-4 h-4" />
                        Öppna modulen
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      Publiceras snart
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Tillgången aktiveras automatiskt i din profil när du köper utrustning av oss.
        </motion.p>
      </div>
    </section>
  );
}