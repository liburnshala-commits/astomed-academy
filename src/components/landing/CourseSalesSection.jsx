import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart, Zap, Shield, Award, FileText } from "lucide-react";

const BUNDLE_PRICE = 1995;
const SINGLE_PRICE_LABEL = "499 kr/st";

const benefits = [
  { icon: Shield, text: "Uppfyll SSM- och IVO-krav direkt" },
  { icon: Zap, text: "5 moduler à 15 min – klart på en förmiddag" },
  { icon: FileText, text: "PDF-resurser att spara i er compliance-pärm" },
  { icon: Award, text: "Personligt Astomed-certifikat vid godkänt quiz" },
];

export default function CourseSalesSection() {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
  });

  const publishedModules = modules.filter((m) => m.status === "published");
  const totalModules = modules.length || 5;

  // Check if user already has all published modules purchased
  const { data: userPurchases = [] } = useQuery({
    queryKey: ["user-purchases", user?.id],
    enabled: !!user?.id && publishedModules.length > 0,
    queryFn: () => base44.entities.Purchase.filter({ user_id: user.id, status: "completed" }),
  });

  const purchasedIds = new Set(userPurchases.map((p) => p.module_id));
  const hasBundle = publishedModules.length > 0 && publishedModules.every((m) => purchasedIds.has(m.id));

  const handleBundleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Betalning fungerar bara från den publicerade appen, inte i förhandsvisning.");
      return;
    }
    setLoading(true);
    const response = await base44.functions.invoke("createCheckout", {
      bundle: true,
      bundle_price: BUNDLE_PRICE,
    });
    if (response.data?.checkout_url) {
      window.location.href = response.data.checkout_url;
    }
    setLoading(false);
  };

  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Pitch */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-3">Grundkursen</p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold leading-tight">
              Allt du behöver för<br />
              <span className="text-accent">juridisk trygghet</span>
            </h2>
            <p className="mt-4 font-body text-white/70 leading-relaxed">
              Fem fokuserade moduler om legitimation, yrkesansvar och patienträttigheter — 
              skapade av jurister, anpassade för kliniker med estetisk verksamhet.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm font-body text-white/85">
                  <div className="w-7 h-7 rounded-sm bg-accent/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-accent" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Pricing card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6">
              {/* Bundle price */}
              <div>
                <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm mb-4">
                  Bäst värde – spara 500 kr
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-heading text-5xl font-bold text-white">{BUNDLE_PRICE}</span>
                  <span className="text-white/60 font-body mb-2">kr / klinik</span>
                </div>
                <p className="text-white/50 text-xs mt-1">Hela Grundkursen – alla {totalModules} moduler</p>
              </div>

              {/* Whats included */}
              <ul className="space-y-2">
                {[
                  `${totalModules} moduler med video`,
                  "PDF-resurser till varje modul",
                  "Kunskapskontroll (quiz) per modul",
                  "Personligt Astomed-certifikat",
                  "Livstidsåtkomst",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80 font-body">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {hasBundle ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-accent/20 rounded-sm border border-accent/30 text-accent font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Du har tillgång till hela kursen
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-white gap-2 font-body font-semibold uppercase tracking-wide rounded-sm h-12"
                  onClick={handleBundleCheckout}
                  disabled={loading}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {loading ? "Laddar..." : `Köp hela kursen – ${BUNDLE_PRICE} kr`}
                </Button>
              )}

              <p className="text-center text-xs text-white/40">
                Vill du köpa enstaka moduler? Välj modul nedan — {SINGLE_PRICE_LABEL}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}