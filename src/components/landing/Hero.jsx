import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-primary text-primary-foreground">
      {/* Subtle background texture like Astomed */}
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80&fit=crop')", backgroundSize: "cover", backgroundPosition: "center"}} />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-accent/20 border border-accent/30 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-body font-medium tracking-widest uppercase text-accent">Ny kurserie · Lansering 2025</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white"
          >
            Juridik som<br />
            <span className="text-accent">skyddar</span> din klinik
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base md:text-lg font-body font-light text-white/70 leading-relaxed max-w-xl"
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
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white gap-2 text-sm font-body font-medium px-8 h-11 rounded-sm uppercase tracking-wide">
                Utforska kurser
                <ArrowRight className="w-4 h-4" />
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
                <div className="w-9 h-9 rounded-sm bg-white/10 flex items-center justify-center">
                  <item.icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-white">{item.label}</p>
                  <p className="text-xs font-body text-white/50">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}