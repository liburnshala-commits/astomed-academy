import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const premiumModules = [
  {
    title: "Journalföring och dokumentation",
    description: "Hur kraven omsätts i praktiken – mallar, vanliga misstag och myndigheternas bedömningar.",
    price: "899–1 499 kr",
  },
  {
    title: "Samtycke och informationsgivning",
    description: "Konkreta verktyg för informerat samtycke, hur det dokumenteras och vad som gäller vid minderåriga.",
    price: "899–1 499 kr",
  },
  {
    title: "Läkemedelshantering",
    description: "Praktisk genomgång av regler kring förskrivning, förvaring och delegering av läkemedel.",
    price: "899–1 499 kr",
  },
  {
    title: "Medicintekniska produkter",
    description: "Krav på CE-märkning, användning, underhåll och vad som gäller vid tillbud med utrustning.",
    price: "899–1 499 kr",
  },
  {
    title: "Hygien och smittskydd",
    description: "Hygienrutiner, riskbedömning och hur tillsyn från Smittskyddsenheten brukar se ut i praktiken.",
    price: "899–1 499 kr",
  },
  {
    title: "Ledningssystem och systematiskt kvalitetsarbete",
    description: "Hur ett fungerande ledningssystem byggs upp, dokumenteras och följs upp i vardagen.",
    price: "899–1 499 kr",
  },
  {
    title: "Marknadsföring och sociala medier",
    description: "Hur Konsumentverket och domstolarna bedömt marknadsföring – vilka arbetssätt som innebär risker.",
    price: "899–1 499 kr",
  },
  {
    title: "Förberedelser inför tillsyn och egenkontroll",
    description: "Hur ett tillsynsärende initieras, vilka konsekvenser brister kan få och hur du bäst förbereder dig.",
    price: "899–1 499 kr",
  },
];

export default function PremiumModulesSection() {
  return (
    <section id="premiummoduler" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">Premiummoduler</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Från överblick till<br />praktisk tillämpning
          </h2>
          <p className="mt-4 font-body text-muted-foreground leading-relaxed">
            Fördjupningsmoduler som visar hur regelverken omsätts i praktiken — baserade på konkreta exempel, 
            myndighetsbeslut, rättsfall och erfarenheter från tillsynsärenden.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {premiumModules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card border border-border/50 rounded-xl p-6 flex flex-col gap-3 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-accent" />
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0">{mod.price}</Badge>
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">{mod.title}</h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed flex-1">{mod.description}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-accent mt-1">
                <span>Kommer snart</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}