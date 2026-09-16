import React from "react";
import RequestAccessForm from "@/components/landing/RequestAccessForm";
import { ShieldCheck, Sparkles, Users } from "lucide-react";

export default function RequestAccessSection() {
  return (
    <section id="ansok" className="py-20 px-6 bg-primary">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Info */}
        <div className="text-primary-foreground">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-accent-foreground tracking-wide">Astomed Academy</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Ansök om åtkomst till Academy
          </h2>
          <p className="text-primary-foreground/80 text-base mb-8 max-w-md">
            Astomed Academy är en juridisk e-learningplattform för kliniker. Fyll i formuläret så återkommer vi med inloggningsuppgifter och åtkomst till dina moduler.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-heading font-semibold text-primary-foreground">Patientsäkerhet i fokus</p>
                <p className="text-sm text-primary-foreground/70">Moduler som säkrar yrkesansvar och efterlevnad.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-heading font-semibold text-primary-foreground">För hela teamet</p>
                <p className="text-sm text-primary-foreground/70">Bjud in din personal och följ deras progress.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form card */}
        <div className="bg-card rounded-2xl shadow-2xl border border-border/50 p-6 md:p-8">
          <h3 className="font-heading text-xl font-bold text-card-foreground mb-1">Ansökan</h3>
          <p className="text-sm text-muted-foreground mb-6">Fyll i uppgifter om din klinik. Obligatoriska fält är markerade med *.</p>
          <RequestAccessForm compact />
        </div>
      </div>
    </section>
  );
}