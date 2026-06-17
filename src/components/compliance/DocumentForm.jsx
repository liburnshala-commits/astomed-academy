import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaults = { title: "", category: "rutiner", document_url: "", valid_from: "", valid_until: "", last_reviewed_date: "", reviewed_by: "", status: "current" };

export default function DocumentForm({ open, onClose, onSave, item }) {
  const [form, setForm] = useState(item ? { ...defaults, ...item } : defaults);
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Redigera dokument" : "Lägg till dokument"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Titel *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="t.ex. Strålskyddsrutin Klass 4 Laser" />
            </div>
            <div className="space-y-1.5">
              <Label>Kategori *</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ledningssystem">Ledningssystem</SelectItem>
                  <SelectItem value="rutiner">Rutiner</SelectItem>
                  <SelectItem value="samtycke">Samtycke</SelectItem>
                  <SelectItem value="riskbedomning">Riskbedömning</SelectItem>
                  <SelectItem value="egenkontroll">Egenkontroll</SelectItem>
                  <SelectItem value="hygien">Hygien</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Aktuell</SelectItem>
                  <SelectItem value="needs_review">Behöver granskas</SelectItem>
                  <SelectItem value="expired">Utgången</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Giltigt från</Label>
              <Input type="date" value={form.valid_from} onChange={(e) => set("valid_from", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Giltigt till</Label>
              <Input type="date" value={form.valid_until} onChange={(e) => set("valid_until", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Senast granskad</Label>
              <Input type="date" value={form.last_reviewed_date} onChange={(e) => set("last_reviewed_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Granskad av</Label>
              <Input value={form.reviewed_by} onChange={(e) => set("reviewed_by", e.target.value)} placeholder="Namn" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Länk till dokument (URL)</Label>
              <Input value={form.document_url} onChange={(e) => set("document_url", e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={() => onSave(form)} disabled={!form.title}>Spara</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}