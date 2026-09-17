import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Äntligen juridik som känns relevant för vår vardag på kliniken. Modulerna är korta, konkreta och ger oss en trygghet i mötet med myndigheter.",
    name: "Anna Lindqvist",
    role: "Verksamhetsutövare, Estetik Kliniken Stockholm",
  },
  {
    quote:
      "Som medicinskt ansvarig läkare uppskattar jag att innehållet är juridiskt vattentätt men ändå begripligt för hela teamet. Certifikaten är en bonus.",
    name: "Dr. Henrik Söderberg",
    role: "Medicinskt ansvarig läkare",
  },
  {
    quote:
      "Repetitionskorten gör att kunskapen faktiskt fastnar. Vi rullar ut utbildningen till alla behandlare — det lyfter patientsäkerheten direkt.",
    name: "Maria Berg",
    role: "Klinikchef, Nordic Beauty",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">
            Trygghet och tillit
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground leading-tight">
            Vad kliniker säger om Academy
          </h2>
          <div className="flex items-center justify-center gap-1 mt-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-7 flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/30 mb-4" />
              <p className="text-sm md:text-base font-body text-foreground/80 leading-relaxed flex-1">
                {t.quote}
              </p>
              <div className="mt-6 pt-5 border-t border-border/50">
                <p className="font-heading font-semibold text-foreground">{t.name}</p>
                <p className="text-xs font-body text-muted-foreground mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}