import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ModuleForm({ open, onClose, onSave, module, courseId }) {
  const [form, setForm] = useState(module || {
    course_id: courseId || "",
    title: "",
    description: "",
    content_summary: "",
    module_number: 1,
    duration_minutes: 15,
    price: 999,
    status: "draft",
    script_status: "not_started",
    recording_status: "not_started",
    pdf_status: "not_started",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      module_number: Number(form.module_number),
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{module ? "Redigera modul" : "Ny modul"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Modulnummer</Label>
              <Input type="number" value={form.module_number} onChange={(e) => handleChange("module_number", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Längd (min)</Label>
              <Input type="number" value={form.duration_minutes} onChange={(e) => handleChange("duration_minutes", e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Titel</Label>
            <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="Modulens titel" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Beskrivning</Label>
            <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Kort beskrivning" rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Innehållssammanfattning</Label>
            <Textarea value={form.content_summary} onChange={(e) => handleChange("content_summary", e.target.value)} placeholder="Detaljerat innehåll" rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Pris (kr)</Label>
              <Input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Utkast</SelectItem>
                  <SelectItem value="script_ready">Manus klart</SelectItem>
                  <SelectItem value="recorded">Inspelad</SelectItem>
                  <SelectItem value="editing">I redigering</SelectItem>
                  <SelectItem value="published">Publicerad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Video-URL</Label>
            <Input value={form.video_url || ""} onChange={(e) => handleChange("video_url", e.target.value)} placeholder="https://..." />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">PDF-URL</Label>
            <Input value={form.pdf_url || ""} onChange={(e) => handleChange("pdf_url", e.target.value)} placeholder="https://..." />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Avbryt</Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {module ? "Uppdatera" : "Skapa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}