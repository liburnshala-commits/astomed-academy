import React from "react";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer id="kontakt" className="border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-semibold">Astomed Academy</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              E-learning för kliniker. Juridik, patientsäkerhet och konsumentskydd – paketerat i korta, 
              lättillgängliga moduler.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Plattform</h4>
              <ul className="space-y-2">
                <li><a href="#kurser" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kurser</a></li>
                <li><a href="#om-oss" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Om oss</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Kontakt</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-muted-foreground">info@astomed.se</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Astomed Academy. Alla rättigheter förbehållna.</p>
          <p className="text-xs text-muted-foreground">Ett samarbete mellan Astomed & Medlaw</p>
        </div>
      </div>
    </footer>
  );
}