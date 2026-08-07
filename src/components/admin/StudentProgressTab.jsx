import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Users, GraduationCap, TrendingDown, Award, AlertTriangle,
  Loader2, BarChart3
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentProgressTab({ modules }) {
  const [sortBy, setSortBy] = useState("review_count");

  const { data: quizResults = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["all-quiz-results"],
    queryFn: () => base44.asServiceRole.entities.QuizResult.list("-created_date", 200),
  });

  const { data: flashcards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["all-flashcards"],
    queryFn: () => base44.asServiceRole.entities.Flashcard.list("-review_count", 200),
  });

  const moduleMap = React.useMemo(() => {
    const map = {};
    (modules || []).forEach((m) => { map[m.id] = m; });
    return map;
  }, [modules]);

  // Per-module progress stats
  const moduleProgress = React.useMemo(() => {
    const stats = {};
    (modules || []).forEach((m) => {
      stats[m.id] = {
        title: m.title,
        category: m.category || "grundkurs",
        attempts: 0,
        passed: 0,
        avgScore: 0,
        scores: [],
      };
    });
    quizResults.forEach((r) => {
      if (!stats[r.module_id]) {
        stats[r.module_id] = {
          title: moduleMap[r.module_id]?.title || "Okänd modul",
          category: moduleMap[r.module_id]?.category || "grundkurs",
          attempts: 0,
          passed: 0,
          avgScore: 0,
          scores: [],
        };
      }
      stats[r.module_id].attempts++;
      stats[r.module_id].scores.push(r.score);
      if (r.passed) stats[r.module_id].passed++;
    });
    Object.values(stats).forEach((s) => {
      s.avgScore = s.scores.length
        ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length)
        : 0;
      s.passRate = s.attempts ? Math.round((s.passed / s.attempts) * 100) : 0;
    });
    return Object.values(stats).filter((s) => s.attempts > 0);
  }, [quizResults, modules, moduleMap]);

  // Unique students
  const uniqueStudents = React.useMemo(() => {
    const ids = new Set(quizResults.map((r) => r.user_id).filter(Boolean));
    return ids.size;
  }, [quizResults]);

  // Hardest flashcards
  const hardestFlashcards = React.useMemo(() => {
    const sorted = [...flashcards].sort((a, b) => {
      if (sortBy === "review_count") return (b.review_count || 0) - (a.review_count || 0);
      return 0;
    });
    return sorted.filter((c) => (c.review_count || 0) > 0).slice(0, 20);
  }, [flashcards, sortBy]);

  const isLoading = resultsLoading || cardsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Aktiva elever"
          value={uniqueStudents}
          color="text-accent"
        />
        <StatCard
          icon={GraduationCap}
          label="Genomförda quiz"
          value={quizResults.length}
          color="text-foreground"
        />
        <StatCard
          icon={Award}
          label="Godkända"
          value={quizResults.filter((r) => r.passed).length}
          color="text-emerald-600"
        />
        <StatCard
          icon={TrendingDown}
          label="Underkända"
          value={quizResults.filter((r) => !r.passed).length}
          color="text-amber-600"
        />
      </div>

      {/* Per-module progress */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent" />
          <h2 className="font-heading text-lg font-semibold">Progress per modul</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 text-left">
                <th className="px-6 py-3 font-semibold">Modul</th>
                <th className="px-4 py-3 font-semibold">Kategori</th>
                <th className="px-4 py-3 font-semibold text-center">Försök</th>
                <th className="px-4 py-3 font-semibold text-center">Godkända</th>
                <th className="px-4 py-3 font-semibold text-center">Andel godkända</th>
                <th className="px-4 py-3 font-semibold text-center">Snitt poäng</th>
              </tr>
            </thead>
            <tbody>
              {moduleProgress.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    Inga quiz-resultat ännu.
                  </td>
                </tr>
              ) : (
                moduleProgress.map((s, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="px-6 py-3 font-medium">{s.title}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{s.category}</td>
                    <td className="px-4 py-3 text-center">{s.attempts}</td>
                    <td className="px-4 py-3 text-center">{s.passed}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-medium ${s.passRate >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                        {s.passRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">{s.avgScore}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardest flashcards */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h2 className="font-heading text-lg font-semibold">Mest utmanande flashcards</h2>
        </div>
        {hardestFlashcards.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            Inga flashcards har markerats som "behöver öva" ännu.
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {hardestFlashcards.map((card, i) => (
              <div key={card.id} className="p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-amber-700">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{card.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Svar: {card.answer}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Modul: {moduleMap[card.module_id]?.title || "Okänd"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-amber-600">{card.review_count || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">behöver öva</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
    </div>
  );
}