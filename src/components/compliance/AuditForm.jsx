import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const defaults = { audit_date: "", conducted_by: "", scope: "", findings: "", action_required: false, action_description: "", action_deadline: "", status: "open", next_audit_date: "" };

export default function AuditForm({ open, onClose, onSave, item }) {
  const [form, setForm] = useState(item ? { ...defaults, ...item } : defaults);
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Redigera revision" : "Ny revision / egenkontroll"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Datum *</Label>
              <Input type="date" value={form.audit_date} onChange={(e) => set("audit_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Genomförd av *</Label>
              <Input value={form.conducted_by} onChange={(e) => set("conducted_by", e.target.value)} placeholder="Namn" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Granskningsomfång *</Label>
              <Input value={form.scope} onChange={(e) => set("scope", e.target.value)} placeholder="t.ex. Laserdokumentation, Hela verksamheten" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Observationer / fynd</Label>
              <Textarea value={form.findings} onChange={(e) => set("findings", e.target.value)} rows={3} placeholder="Vad hittades vid granskningen..." />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <Switch checked={form.action_required} onCheckedChange={(v) => set("action_required", v)} id="action-switch" />
              <Label htmlFor="action-switch" className="cursor-pointer">Åtgärd krävs</Label>
            </div>
            {form.action_required && (
              <>
                <div className="col-span-2 space-y-1.5">
                  <Label>Åtgärdsbeskrivning</Label>
                  <Textarea value={form.action_description} onChange={(e) => set("action_description", e.target.value)} rows={2} placeholder="Beskriv vad som behöver göras..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Deadline för åtgärd</Label>
                  <Input type="date" value={form.action_deadline} onChange={(e) => set("action_deadline", e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Öppen</SelectItem>
                  <SelectItem value="completed">Genomförd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nästa revision</Label>
              <Input type="date" value={form.next_audit_date} onChange={(e) => set("next_audit_date", e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={() => onSave(form)} disabled={!form.audit_date || !form.conducted_by || !form.scope}>Spara</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}