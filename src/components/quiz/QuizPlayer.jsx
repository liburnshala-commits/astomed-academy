import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Award, Download, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPlayer({ moduleId, onCertificateReady }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);
  const [certUrl, setCertUrl] = useState(null);

  const { data: quiz } = useQuery({
    queryKey: ["quiz", moduleId],
    queryFn: async () => {
      const quizzes = await base44.entities.Quiz.filter({ module_id: moduleId, is_active: true });
      return quizzes[0] || null;
    },
  });

  const { data: questions = [] } = useQuery({
    queryKey: ["quiz-questions", quiz?.id],
    enabled: !!quiz?.id,
    queryFn: async () => {
      const qs = await base44.entities.QuizQuestion.filter({ quiz_id: quiz.id });
      return qs.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  });

  const { data: existingResult } = useQuery({
    queryKey: ["quiz-result", moduleId, user?.id],
    enabled: !!user?.id && !!quiz?.id,
    queryFn: async () => {
      const results = await base44.entities.QuizResult.filter({
        module_id: moduleId,
        user_id: user.id,
        passed: true,
      });
      return results[0] || null;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (finalAnswers) => {
      const correct = finalAnswers.filter(
        (a, i) => a === questions[i].correct_option_index
      ).length;
      const score = Math.round((correct / questions.length) * 100);
      const passed = score >= (quiz.passing_score || 80);

      const prevResults = await base44.entities.QuizResult.filter({
        quiz_id: quiz.id,
        user_id: user.id,
      });
      const attempt = prevResults.length + 1;

      const result = await base44.entities.QuizResult.create({
        quiz_id: quiz.id,
        module_id: moduleId,
        user_id: user.id,
        user_name: user.full_name || "",
        user_email: user.email || "",
        score,
        correct_answers: correct,
        total_questions: questions.length,
        passed,
        attempt_number: attempt,
        completed_at: new Date().toISOString(),
      });
      return result;
    },
    onSuccess: (result) => {
      setQuizResult(result);
      setShowResult(true);
      queryClient.invalidateQueries({ queryKey: ["quiz-result", moduleId, user?.id] });
      if (result.passed) {
        generateCertificate(result.id);
      }
    },
  });

  const generateCertificate = async (resultId) => {
    setGeneratingCert(true);
    const response = await base44.functions.invoke("generateCertificate", {
      quiz_result_id: resultId,
    });
    if (response.data?.certificate_url) {
      setCertUrl(response.data.certificate_url);
      onCertificateReady?.(response.data.certificate_url);
      queryClient.invalidateQueries({ queryKey: ["certificate", moduleId, user?.id] });
    }
    setGeneratingCert(false);
  };

  const handleAnswer = (optionIdx) => {
    if (selected !== null) return;
    setSelected(optionIdx);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selected];
    if (currentQ < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      submitMutation.mutate(newAnswers);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setQuizResult(null);
    setCertUrl(null);
  };

  if (!quiz || questions.length === 0) return null;

  // Already passed
  if (existingResult) {
    return (
      <div className="mt-8 bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-500/20 rounded-2xl p-8 text-center">
        <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="font-heading text-lg font-semibold text-white">Quiz godkänt!</h3>
        <p className="text-sm text-emerald-300/70 mt-1">
          Du har klarat kunskapskontrollen med {Math.round(existingResult.score)}%.
        </p>
        {existingResult.certificate_url && (
          <a href={existingResult.certificate_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Download className="w-4 h-4" />
              Ladda ner certifikat
            </Button>
          </a>
        )}
      </div>
    );
  }

  // Result screen
  if (showResult && quizResult) {
    const passed = quizResult.passed;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`mt-8 rounded-2xl border p-8 text-center ${
          passed
            ? "bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border-emerald-500/20"
            : "bg-gradient-to-br from-red-950/30 to-rose-950/30 border-red-500/20"
        }`}
      >
        {passed ? (
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        ) : (
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        )}
        <h3 className="font-heading text-xl font-bold text-white">
          {passed ? "Grattis, du klarade quizet!" : "Tyvärr, inte godkänt"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Du svarade rätt på {quizResult.correct_answers} av {quizResult.total_questions} frågor
          ({Math.round(quizResult.score)}%)
        </p>
        {!passed && (
          <p className="text-xs text-muted-foreground mt-1">
            Godkänt kräver {quiz.passing_score || 80}% — försök igen!
          </p>
        )}

        {passed && (
          <div className="mt-6">
            {generatingCert ? (
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                Genererar ditt certifikat…
              </div>
            ) : certUrl ? (
              <a href={certUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Download className="w-4 h-4" />
                  Ladda ner certifikat
                </Button>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4" />
                Kunde inte generera certifikat
              </div>
            )}
          </div>
        )}

        {!passed && (
          <Button variant="outline" className="mt-6" onClick={handleRetry}>
            Försök igen
          </Button>
        )}
      </motion.div>
    );
  }

  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className="mt-8">
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            <span className="font-heading text-sm font-semibold">Kunskapskontroll</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {currentQ + 1} / {questions.length}
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

        {/* Question */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-heading text-base font-semibold text-foreground mb-5 leading-snug">
                {question.question_text}
              </p>

              <div className="space-y-2">
                {question.options?.map((option, idx) => {
                  let style = "border border-border bg-muted/30 hover:bg-muted/60 text-foreground";
                  if (selected !== null) {
                    if (idx === question.correct_option_index) {
                      style = "border border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                    } else if (idx === selected && idx !== question.correct_option_index) {
                      style = "border border-red-500 bg-red-500/10 text-red-700 dark:text-red-300";
                    } else {
                      style = "border border-border/40 bg-muted/20 text-muted-foreground";
                    }
                  } else if (selected === idx) {
                    style = "border border-accent bg-accent/10 text-accent";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selected !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-150 cursor-pointer ${style}`}
                    >
                      <span className="font-semibold mr-2 text-xs opacity-60">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selected !== null && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20 text-xs text-muted-foreground"
                >
                  <span className="font-semibold text-accent">Förklaring: </span>
                  {question.explanation}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        {selected !== null && (
          <div className="px-6 pb-5 flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending
                ? "Sparar..."
                : currentQ < questions.length - 1
                ? "Nästa fråga →"
                : "Avsluta quiz"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}