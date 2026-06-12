import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuizForm({ open, quiz, modules, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: quiz?.title || "",
    module_id: quiz?.module_id || "",
    passing_score: quiz?.passing_score ?? 80,
    max_attempts: quiz?.max_attempts ?? 3,
    is_active: quiz?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    if (quiz) {
      await base44.entities.Quiz.update(quiz.id, form);
    } else {
      await base44.entities.Quiz.create(form);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{quiz ? "Redigera quiz" : "Skapa nytt quiz"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Modul</Label>
            <Select value={form.module_id} onValueChange={(v) => setForm({ ...form, module_id: v })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Välj modul…" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    Modul {m.module_number}: {m.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quiztitel</Label>
            <Input className="mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="t.ex. Kunskapskontroll – Modul 1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Godkänt (%)</Label>
              <Input className="mt-1" type="number" min={0} max={100} value={form.passing_score}
                onChange={(e) => setForm({ ...form, passing_score: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Max försök</Label>
              <Input className="mt-1" type="number" min={1} value={form.max_attempts}
                onChange={(e) => setForm({ ...form, max_attempts: Number(e.target.value) })} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={handleSave} disabled={saving || !form.title || !form.module_id}>
              {saving ? "Sparar…" : "Spara"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}