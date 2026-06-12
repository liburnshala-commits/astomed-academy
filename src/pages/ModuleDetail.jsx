import React, { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Clock, FileText, Download, PlayCircle,
  Lock, CheckCircle, ShoppingCart, LogIn, Award
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import QuizPlayer from "@/components/quiz/QuizPlayer";

const statusLabels = {
  draft: "Under utveckling",
  script_ready: "Manus klart",
  recorded: "Inspelad",
  editing: "I redigering",
  published: "Tillgänglig",
};

export default function ModuleDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, navigateToLogin } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const queryClient = useQueryClient();

  const paymentStatus = searchParams.get("payment");

  const { data: module, isLoading: moduleLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const modules = await base44.entities.Module.filter({ id });
      return modules[0];
    },
  });

  const { data: purchase, isLoading: purchaseLoading } = useQuery({
    queryKey: ["purchase", id, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const purchases = await base44.entities.Purchase.filter({
        module_id: id,
        user_id: user.id,
        status: "completed",
      });
      return purchases[0] || null;
    },
  });

  const { data: certificate, isLoading: certLoading } = useQuery({
    queryKey: ["certificate", id, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const results = await base44.entities.QuizResult.filter({
        module_id: id,
        user_id: user.id,
        passed: true,
      });
      return results[0] || null;
    },
  });

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Betalning fungerar bara från den publicerade appen, inte i förhandsvisning.");
      return;
    }
    if (!isAuthenticated) {
      navigateToLogin();
      return;
    }
    setCheckingOut(true);
    const response = await base44.functions.invoke("createCheckout", {
      module_id: id,
    });
    if (response.data?.checkout_url) {
      window.location.href = response.data.checkout_url;
    }
    setCheckingOut(false);
  };

  const isLoading = moduleLoading || (isAuthenticated && (purchaseLoading || certLoading));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center px-6">
          <h1 className="font-heading text-2xl font-bold">Modulen hittades inte</h1>
          <Link to="/" className="text-accent hover:underline mt-4 inline-block">Tillbaka till startsidan</Link>
        </div>
      </div>
    );
  }

  const isPublished = module.status === "published";
  const hasPurchased = !!purchase;
  const isCompletedAndLocked = hasPurchased && !!certificate;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Tillbaka
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <Badge className="bg-accent/10 text-accent-foreground border-0 text-[10px] uppercase tracking-wider font-semibold">
                Modul {module.module_number}
              </Badge>
              <h1 className="mt-3 font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {module.title}
              </h1>
            </div>
            <Badge className="bg-muted text-muted-foreground border-0 text-xs">
              {statusLabels[module.status] || "Under utveckling"}
            </Badge>
          </div>

          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {module.duration_minutes || 15} minuter
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              PDF-resurs inkluderad
            </span>
          </div>

          <div className="mt-10 bg-card rounded-2xl border border-border/50 p-8">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Om denna modul</h2>
            <p className="text-muted-foreground leading-relaxed">{module.description}</p>

            {module.content_summary && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Innehåll</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{module.content_summary}</p>
              </div>
            )}
          </div>

          {paymentStatus === "success" && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-green-800">Köp genomfört!</h3>
                <p className="text-sm text-green-700 mt-1">Tack för ditt köp. Du har nu tillgång till modulen nedan.</p>
              </div>
            </div>
          )}

          {isPublished && (
            <>
              {/* Completed & locked */}
              {isCompletedAndLocked && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
                  <Award className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="font-heading text-lg font-semibold text-amber-900">Utbildning avklarad</h3>
                  <p className="text-sm text-amber-700 mt-2 max-w-md mx-auto">
                    Du har godkänts och erhållit ett certifikat för denna modul. Kursinnehållet är nu låst.
                  </p>
                  {certificate.certificate_url && (
                    <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
                      <Button variant="outline" className="gap-2 border-amber-300 text-amber-800 hover:bg-amber-100">
                        <Download className="w-4 h-4" />
                        Ladda ner certifikat
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Purchased, not yet completed */}
              {hasPurchased && !isCompletedAndLocked && (
                <div className="mt-8 space-y-4">
                  <QuizPlayer
                    moduleId={id}
                    onCertificateReady={() => {
                      queryClient.invalidateQueries({ queryKey: ["certificate", id, user?.id] });
                    }}
                  />
                  {module.video_url ? (
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={module.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={module.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                      <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-3">
                        <PlayCircle className="w-16 h-16 text-muted-foreground/30" />
                        <span className="text-muted-foreground text-sm">Video publiceras snart</span>
                      </div>
                    </div>
                  )}
                  {module.pdf_url && (
                    <a href={module.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Ladda ner PDF-resurs
                      </Button>
                    </a>
                  )}
                </div>
              )}

              {/* Not purchased */}
              {!hasPurchased && module.price && (
                <div className="mt-8 bg-card rounded-2xl border border-accent/20 p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Pris per modul</p>
                      <p className="font-heading text-3xl font-bold text-foreground mt-1">
                        {module.price} <span className="text-lg font-normal text-muted-foreground">kr</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Inkl. video, PDF-resurs och certifikat</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      {isAuthenticated ? (
                        <Button
                          size="lg"
                          className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 gap-2"
                          onClick={handleCheckout}
                          disabled={checkingOut}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {checkingOut ? "Laddar..." : "Köp modul"}
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="lg"
                            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 gap-2"
                            onClick={() => navigateToLogin()}
                          >
                            <LogIn className="w-4 h-4" />
                            Logga in för att köpa
                          </Button>
                          <p className="text-xs text-center text-muted-foreground">
                            Du behöver ett konto för att komma åt kursinnehållet
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!isPublished && (
            <div className="mt-8 bg-muted/50 rounded-2xl border border-border/50 p-8 text-center">
              <Lock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-semibold text-foreground">Kommer snart</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Denna modul är under produktion. Inspelning planeras till 23 juni 2025.
              </p>
            </div>
          )}

        </motion.div>
      </div>
      <Footer />
    </div>
  );
}