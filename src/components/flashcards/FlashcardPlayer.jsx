import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers, Loader2, ChevronLeft, ChevronRight, RotateCw,
  Check, RefreshCw, AlertCircle, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlashcardPlayer({ moduleId }) {
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [knownIds, setKnownIds] = useState(new Set());
  const [reviewIds, setReviewIds] = useState(new Set());
  const [finished, setFinished] = useState(false);

  const { data: flashcards = [], isLoading } = useQuery({
    queryKey: ["flashcards", moduleId],
    queryFn: async () => {
      const cards = await base44.entities.Flashcard.filter({ module_id: moduleId });
      return cards.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      const response = await base44.functions.invoke("generateFlashcards", { module_id: moduleId });
      if (response.data?.error) {
        setGenError(response.data.error);
      } else {
        queryClient.invalidateQueries({ queryKey: ["flashcards", moduleId] });
      }
    } catch (e) {
      setGenError("Kunde inte generera kortlek. Försök igen senare.");
    }
    setGenerating(false);
  };

  const goTo = (idx) => {
    setFlipped(false);
    setTimeout(() => setCurrent(idx), 150);
  };

  const markCard = (known) => {
    const card = flashcards[current];
    if (known) {
      setKnownIds((prev) => new Set(prev).add(card.id));
      setReviewIds((prev) => { const n = new Set(prev); n.delete(card.id); return n; });
    } else {
      setReviewIds((prev) => new Set(prev).add(card.id));
      setKnownIds((prev) => { const n = new Set(prev); n.delete(card.id); return n; });
    }
    if (current < flashcards.length - 1) {
      goTo(current + 1);
    } else {
      setFinished(true);
    }
  };

  const restart = (onlyReview = false) => {
    if (onlyReview) {
      const reviewCards = flashcards.filter((c) => reviewIds.has(c.id));
      if (reviewCards.length === 0) return;
      // Reset only review cards
      setReviewIds(new Set());
      const firstReviewIdx = flashcards.findIndex((c) => reviewIds.has(c.id));
      setFinished(false);
      goTo(firstReviewIdx);
    } else {
      setKnownIds(new Set());
      setReviewIds(new Set());
      setFinished(false);
      goTo(0);
    }
  };

  // No flashcards yet — offer generation
  if (!isLoading && flashcards.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-accent" />
          <span className="font-heading text-sm font-semibold">Öva med kortlek</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Repetitionskort (flashcards) hjälper dig memorera de viktigaste juridiska punkterna genom
          <span className="font-medium text-foreground"> active recall</span>. Generera en AI-skapad
          kortlek baserad på modulens innehåll.
        </p>
        {genError && (
          <p className="text-xs text-destructive mb-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {genError}
          </p>
        )}
        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Genererar kortlek…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generera kortlek
            </>
          )}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border/50 p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Summary screen
  if (finished) {
    const knownCount = knownIds.size;
    const reviewCount = reviewIds.size;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border/50 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <span className="font-heading text-sm font-semibold">Kortlek avklarad</span>
        </div>
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-emerald-600">{knownCount}</div>
              <div className="text-xs text-muted-foreground mt-1">kan</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-amber-600">{reviewCount}</div>
              <div className="text-xs text-muted-foreground mt-1">behöver öva</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {reviewCount === 0
              ? "Bra jobbat! Du kan alla kort i denna modul."
              : `${reviewCount} kort behöver repetition. Öva på dem igen för att befästa kunskapen.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {reviewCount > 0 && (
              <Button
                onClick={() => restart(true)}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Öva på {reviewCount} svåra kort
              </Button>
            )}
            <Button
              onClick={() => restart(false)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Börja om
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  const card = flashcards[current];
  const progress = ((current + 1) / flashcards.length) * 100;

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <span className="font-heading text-sm font-semibold">Öva med kortlek</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {current + 1} / {flashcards.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setFlipped(!flipped)}
              className="w-full text-left min-h-[200px] sm:min-h-[240px] rounded-2xl border-2 border-border bg-gradient-to-br from-muted/30 to-muted/10 p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-accent/40 cursor-pointer"
            >
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-4">
                {flipped ? "Svar" : "Fråga"}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={flipped ? "answer" : "question"}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 90 }}
                  transition={{ duration: 0.2 }}
                  className="font-heading text-lg sm:text-xl font-semibold text-foreground leading-snug"
                >
                  {flipped ? card.answer : card.question}
                </motion.p>
              </AnimatePresence>
              {!flipped && (
                <p className="text-xs text-muted-foreground/50 mt-6">
                  Tryck på kortet för att vända
                </p>
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        {flipped ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-3"
          >
            <Button
              onClick={() => markCard(false)}
              variant="outline"
              className="flex-1 gap-2 border-amber-400/50 text-amber-700 hover:bg-amber-50"
            >
              <RefreshCw className="w-4 h-4" />
              Behöver öva
            </Button>
            <Button
              onClick={() => markCard(true)}
              className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="w-4 h-4" />
              Kan
            </Button>
          </motion.div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => goTo(current - 1)}
              variant="ghost"
              size="sm"
              disabled={current === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Föregående
            </Button>
            <Button
              onClick={() => goTo(current + 1)}
              variant="ghost"
              size="sm"
              disabled={current === flashcards.length - 1}
              className="gap-1"
            >
              Nästa
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}