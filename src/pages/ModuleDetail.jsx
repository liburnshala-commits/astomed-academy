import React from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileText, Download, PlayCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const statusLabels = {
  draft: "Under utveckling",
  script_ready: "Manus klart",
  recorded: "Inspelad",
  editing: "I redigering",
  published: "Tillgänglig",
};

export default function ModuleDetail() {
  const { id } = useParams();

  const { data: module, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: async () => {
      const modules = await base44.entities.Module.filter({ id });
      return modules[0];
    },
  });

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

          {isPublished ? (
            <div className="mt-8 space-y-4">
              {module.video_url && (
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-muted-foreground/50" />
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
          ) : (
            <div className="mt-8 bg-muted/50 rounded-2xl border border-border/50 p-8 text-center">
              <Lock className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-semibold text-foreground">Kommer snart</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Denna modul är under produktion. Inspelning planeras till 23 juni 2025.
              </p>
            </div>
          )}

          {module.price && (
            <div className="mt-8 bg-card rounded-2xl border border-accent/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Pris per modul</p>
                <p className="font-heading text-3xl font-bold text-foreground mt-1">
                  {module.price} <span className="text-lg font-normal text-muted-foreground">kr</span>
                </p>
              </div>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
                disabled={!isPublished}
              >
                {isPublished ? "Köp modul" : "Meddela mig vid lansering"}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}