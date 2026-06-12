import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Award, Download, FileX } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

export default function MyCertificates() {
  const { user, isAuthenticated, navigateToLogin } = useAuth();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["my-certificates", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const all = await base44.entities.QuizResult.filter({
        user_id: user.id,
        passed: true,
      });
      return all.filter((r) => !!r.certificate_url);
    },
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["modules-for-certs"],
    enabled: results.length > 0,
    queryFn: () => base44.entities.Module.list("module_number"),
  });

  const getModule = (moduleId) => modules.find((m) => m.id === moduleId);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 text-center px-6">
          <Award className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold mb-2">Mina certifikat</h1>
          <p className="text-muted-foreground mb-6">Du måste vara inloggad för att se dina certifikat.</p>
          <Button onClick={() => navigateToLogin()} className="bg-accent text-accent-foreground">
            Logga in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">Mina certifikat</h1>
              <p className="text-sm text-muted-foreground">Dina avklarade kursintyg</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
              <FileX className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Inga certifikat ännu</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Slutför en kurs och klara kunskapskontrollen för att få ditt certifikat.
              </p>
              <Link to="/">
                <Button variant="outline">Utforska kurser</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, i) => {
                const mod = getModule(result.module_id);
                const date = result.completed_at
                  ? new Date(result.completed_at).toLocaleDateString("sv-SE")
                  : "";
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-2xl border border-border/50 p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-foreground">
                          {mod ? `Modul ${mod.module_number}: ${mod.title}` : result.module_id}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Godkänt {date} · Resultat: {Math.round(result.score)}%
                        </p>
                      </div>
                    </div>
                    <a href={result.certificate_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="gap-2 shrink-0">
                        <Download className="w-4 h-4" />
                        Ladda ner
                      </Button>
                    </a>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}