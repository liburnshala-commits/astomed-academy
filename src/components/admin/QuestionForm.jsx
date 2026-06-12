import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function QuestionForm({ open, quizId, question, questionCount, onClose, onSaved }) {
  const [form, setForm] = useState({
    question_text: question?.question_text || "",
    options: question?.options || ["", "", "", ""],
    correct_option_index: question?.correct_option_index ?? 0,
    explanation: question?.explanation || "",
    order: question?.order ?? questionCount + 1,
  });
  const [saving, setSaving] = useState(false);

  const setOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm({ ...form, options: opts });
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, quiz_id: quizId };
    if (question) {
      await base44.entities.QuizQuestion.update(question.id, data);
    } else {
      await base44.entities.QuizQuestion.create(data);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Redigera fråga" : "Ny fråga"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Fråga</Label>
            <Textarea className="mt-1" rows={3} value={form.question_text}
              onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              placeholder="Skriv frågan här…" />
          </div>

          <div>
            <Label>Svarsalternativ <span className="text-muted-foreground font-normal">(klicka på rätt svar)</span></Label>
            <div className="mt-2 space-y-2">
              {form.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, correct_option_index: idx })}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      form.correct_option_index === idx
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {form.correct_option_index === idx && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </button>
                  <span className="text-xs font-bold text-muted-foreground w-4">{String.fromCharCode(65 + idx)}.</span>
                  <Input
                    value={opt}
                    onChange={(e) => setOption(idx, e.target.value)}
                    placeholder={`Alternativ ${String.fromCharCode(65 + idx)}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Förklaring <span className="text-muted-foreground font-normal">(visas efter svar)</span></Label>
            <Textarea className="mt-1" rows={2} value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              placeholder="Pedagogisk förklaring till rätt svar…" />
          </div>

          <div>
            <Label>Ordning</Label>
            <Input className="mt-1 w-24" type="number" min={1} value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={handleSave}
              disabled={saving || !form.question_text || form.options.some((o) => !o.trim())}>
              {saving ? "Sparar…" : "Spara"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}