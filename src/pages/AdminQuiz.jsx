import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import QuizForm from "@/components/admin/QuizForm";
import QuestionForm from "@/components/admin/QuestionForm";

export default function AdminQuiz() {
  const queryClient = useQueryClient();
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [showQuestionForm, setShowQuestionForm] = useState(null); // quiz_id
  const [editQuestion, setEditQuestion] = useState(null);

  const { data: modules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: () => base44.entities.Module.list("module_number"),
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ["all-quizzes"],
    queryFn: () => base44.entities.Quiz.list(),
  });

  const { data: allQuestions = [] } = useQuery({
    queryKey: ["all-questions"],
    queryFn: () => base44.entities.QuizQuestion.list(),
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (id) => base44.entities.Quiz.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-quizzes"] }),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id) => base44.entities.QuizQuestion.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-questions"] }),
  });

  const moduleMap = Object.fromEntries(modules.map((m) => [m.id, m]));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-heading text-lg font-semibold">Quiz-hantering</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" />
                Tillbaka
              </Button>
            </Link>
            <Button size="sm" className="gap-2" onClick={() => { setEditQuiz(null); setShowQuizForm(true); }}>
              <Plus className="w-4 h-4" />
              Nytt quiz
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {quizzes.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Inga quiz ännu. Klicka "Nytt quiz" för att börja.</p>
        )}

        {quizzes.map((quiz) => {
          const mod = moduleMap[quiz.module_id];
          const questions = allQuestions
            .filter((q) => q.quiz_id === quiz.id)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          const expanded = expandedQuizId === quiz.id;

          return (
            <div key={quiz.id} className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading font-semibold text-sm">{quiz.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mod ? `Modul ${mod.module_number}: ${mod.title}` : "Okänd modul"} ·{" "}
                    {questions.length} frågor · Godkänt: {quiz.passing_score || 80}%
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => { setEditQuiz(quiz); setShowQuizForm(true); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                    onClick={() => deleteQuizMutation.mutate(quiz.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setExpandedQuizId(expanded ? null : quiz.id)}>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span className="ml-1 text-xs">Frågor</span>
                  </Button>
                </div>
              </div>

              {expanded && (
                <div className="border-t border-border/50 px-6 py-4 space-y-3">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                      <span className="text-xs font-bold text-muted-foreground mt-0.5 w-5 shrink-0">{idx + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{q.question_text}</p>
                        <div className="mt-2 grid grid-cols-2 gap-1">
                          {q.options?.map((opt, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded ${i === q.correct_option_index ? "bg-emerald-500/15 text-emerald-700 font-semibold" : "text-muted-foreground"}`}>
                              {String.fromCharCode(65 + i)}. {opt}
                            </span>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="text-xs text-muted-foreground mt-1 italic">💡 {q.explanation}</p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => { setEditQuestion(q); setShowQuestionForm(quiz.id); }}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                          onClick={() => deleteQuestionMutation.mutate(q.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button size="sm" variant="outline" className="gap-2 w-full mt-2"
                    onClick={() => { setEditQuestion(null); setShowQuestionForm(quiz.id); }}>
                    <Plus className="w-3.5 h-3.5" />
                    Lägg till fråga
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showQuizForm && (
        <QuizForm
          open={showQuizForm}
          quiz={editQuiz}
          modules={modules}
          onClose={() => { setShowQuizForm(false); setEditQuiz(null); }}
          onSaved={() => { queryClient.invalidateQueries({ queryKey: ["all-quizzes"] }); setShowQuizForm(false); setEditQuiz(null); }}
        />
      )}

      {showQuestionForm && (
        <QuestionForm
          open={!!showQuestionForm}
          quizId={showQuestionForm}
          question={editQuestion}
          questionCount={allQuestions.filter((q) => q.quiz_id === showQuestionForm).length}
          onClose={() => { setShowQuestionForm(null); setEditQuestion(null); }}
          onSaved={() => { queryClient.invalidateQueries({ queryKey: ["all-questions"] }); setShowQuestionForm(null); setEditQuestion(null); }}
        />
      )}
    </div>
  );
}