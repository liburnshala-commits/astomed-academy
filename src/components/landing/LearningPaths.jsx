import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Building2, Stethoscope, Sparkles, Wrench, Users, ArrowRight, Clock, Lock } from "lucide-react";

const paths = [
  {
    id: "verksamhetsutovare",
    role: "verksamhetsutovare",
    icon: Building2,
    title: "Verksamhetsutövare eller klinikägare",
    description:
      "Övergripande ansvar, ledningssystem, patientsäkerhet och myndighetskontakter — för dig som driver eller äger verksamheten.",
  },
  {
    id: "medicinskt-ansvarig",
    role: "medicinskt_ansvarig_lakare",
    icon: Stethoscope,
    title: "Medicinskt ansvarig läkare",
    description:
      "Juridik kring medicinska beslut, journalföring, delegering, samtycke och det medicinska ledningsansvaret.",
  },
  {
    id: "behandlare",
    role: "behandlare",
    icon: Sparkles,
    title: "Behandlare",
    description:
      "Praktiska regler för säker behandling — hygien, samtycke, utrustningsanvändning och dokumentation i vardagen.",
  },
  {
    id: "teknisk-ansvarig",
    role: "teknisk_ansvarig",
    icon: Wrench,
    title: "Teknisk ansvarig",
    description:
      "Krav på medicinteknisk utrustning, service, kalibrering, leverans- och funktionskontroll samt egenkontroll.",
  },
  {
    id: "allman-personal",
    role: "allman_personal",
    icon: Users,
    title: "Allmän personal",
    description:
      "Grundläggande rutiner, hygien, patientsäkerhet och serviceinriktat bemötande för hela klinikteamet.",
  },
];

export default function LearningPaths() {
  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
  });

  const modulesForRole = (role) =>
    modules.filter((m) => (m.target_roles || []).includes(role));

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

        <div className="space-y-6">
          {paths.map((p, i) => {
            const Icon = p.icon;
            const roleModules = modulesForRole(p.role);
            return (
              <motion.div
                key={p.id}
                id={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="scroll-mt-24 bg-card border border-border/50 rounded-xl overflow-hidden"
              >
                <div className="p-7 md:p-8 border-b border-border/40">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground leading-snug">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm font-body text-muted-foreground leading-relaxed max-w-2xl">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-7 md:p-8">
                  {roleModules.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {roleModules.map((m) => {
                        const isGated =
                          (m.category || "grundkurs") === "grundkurs" &&
                          m.module_number >= 1 &&
                          m.module_number <= 4;
                        return (
                          <Link
                            key={m.id}
                            to={isGated ? "#" : `/modul/${m.id}`}
                            onClick={isGated ? (e) => e.preventDefault() : undefined}
                            className={`group flex items-center justify-between gap-3 rounded-lg border border-border/50 px-4 py-3 transition-colors ${isGated ? "opacity-70 cursor-not-allowed" : "hover:border-accent/40 hover:bg-muted/30"}`}
                          >
                            <div className="min-w-0">
                              <p className="font-heading text-sm font-semibold text-foreground truncate">
                                {m.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {m.duration_minutes || 15} min
                              </p>
                            </div>
                            {isGated ? (
                              <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ArrowRight className="w-4 h-4 text-accent shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Moduler för denna roll publiceras snart.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}