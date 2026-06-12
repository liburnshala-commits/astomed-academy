import React from "react";

export default function Footer() {
  return (
    <footer id="kontakt" className="bg-primary text-primary-foreground border-t border-white/10 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-heading text-xl font-semibold text-white">Astomed</span>
              <sup className="text-[10px] text-white/50 mt-1">™</sup>
              <span className="ml-2 text-xs font-body font-medium uppercase tracking-[0.18em] text-accent border-l border-white/20 pl-2">Academy</span>
            </div>
            <p className="text-sm font-body font-light text-white/60 leading-relaxed">
              E-learning för kliniker. Juridik, patientsäkerhet och konsumentskydd – 
              paketerat i korta, lättillgängliga moduler.
            </p>
            <p className="text-xs font-body text-white/40 mt-4">Ett samarbete mellan Astomed & Medlaw</p>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-widest mb-4">Plattform</h4>
              <ul className="space-y-2.5">
                <li><a href="#kurser" className="text-sm font-body text-white/60 hover:text-white transition-colors">Kurser</a></li>
                <li><a href="#om-oss" className="text-sm font-body text-white/60 hover:text-white transition-colors">Om oss</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-heading font-semibold text-white uppercase tracking-widest mb-4">Kontakt</h4>
              <ul className="space-y-2.5">
                <li><span className="text-sm font-body text-white/60">info@astomed.se</span></li>
                <li><span className="text-sm font-body text-white/60">08 410 77 900</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body text-white/40">© {new Date().getFullYear()} Astomed Academy. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}