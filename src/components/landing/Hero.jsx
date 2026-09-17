import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroApplyForm from "@/components/landing/HeroApplyForm";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6a2bb2f0c7148c2a75c598c0/76762b02c_generated_image.png";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-primary text-primary-foreground">
      {/* Photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      />
      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/30" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Hero text */}
          <div className="max-w-3xl lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-5">
                Störst i Norden på juridisk e-learning för kliniker
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-white"
            >
              Kunskap som<br />
              <span className="text-accent">skyddar</span> din klinik
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base md:text-lg font-body font-light text-white/75 leading-relaxed max-w-xl"
            >
              Korta, klarspråkiga 15-minutersmoduler som hjälper dig navigera rättsliga regelverk,
              öka patientsäkerheten och undvika anmälningar. Skapad av jurister, paketerad för kliniker.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a href="#kurser">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white gap-2 text-sm font-body font-semibold px-8 h-12 rounded-full"
                >
                  Utforska kurser
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="#ansok">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white gap-2 text-sm font-body font-semibold px-8 h-12 rounded-full"
                >
                  Ansök om åtkomst
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 flex flex-wrap gap-8 border-t border-white/10 pt-10"
            >
              {[
                { icon: Clock, label: "15 min/modul", sublabel: "Snabbt & effektivt" },
                { icon: Shield, label: "Juridisk expertis", sublabel: "Medlaw-samarbete" },
                { icon: Award, label: "PDF-resurser", sublabel: "Nedladdningsbara" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold text-white">{item.label}</p>
                    <p className="text-xs font-body text-white/50">{item.sublabel}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Free-floating application form (desktop) */}
          <div className="lg:col-span-5">
            <HeroApplyForm />
          </div>
        </div>
      </div>
    </section>
  );
}