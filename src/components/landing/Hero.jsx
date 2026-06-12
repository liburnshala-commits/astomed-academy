import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium tracking-wide uppercase text-accent-foreground/80">Ny kurserie · Lansering 2025</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground"
          >
            Juridik som
            <span className="text-accent"> skyddar </span>
            din klinik
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
          >
            Korta, klarspråkiga 15-minutersmoduler som hjälper dig navigera rättsliga regelverk, 
            öka patientsäkerheten och undvika anmälningar. Skapad av jurister, paketerad för kliniker.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <a href="#kurser">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base px-8 h-12">
                Utforska kurser
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap gap-8"
          >
            {[
              { icon: Clock, label: "15 min/modul", sublabel: "Snabbt & effektivt" },
              { icon: Shield, label: "Juridisk expertis", sublabel: "Medlaw-samarbete" },
              { icon: Award, label: "PDF-resurser", sublabel: "Nedladdningsbara" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}