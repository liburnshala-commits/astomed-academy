import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const defaults = { incident_date: "", type: "near_miss", description: "", equipment_id: "", equipment_name: "", reported_to: "internal", status: "open", corrective_action: "", closed_date: "" };

export default function IncidentForm({ open, onClose, onSave, item, equipment }) {
  const [form, setForm] = useState(item ? { ...defaults, ...item } : defaults);
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleEquipmentChange = (id) => {
    const eq = equipment.find((e) => e.id === id);
    set("equipment_id", id);
    set("equipment_name", eq?.name || "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Redigera avvikelse" : "Ny avvikelse"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Datum *</Label>
              <Input type="date" value={form.incident_date} onChange={(e) => set("incident_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Typ *</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient_injury">Patientskada</SelectItem>
                  <SelectItem value="near_miss">Tillbud</SelectItem>
                  <SelectItem value="equipment_fault">Utrustningsfel</SelectItem>
                  <SelectItem value="complaint">Klagomål</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Beskrivning *</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Beskriv vad som hände..." />
            </div>
            <div className="space-y-1.5">
              <Label>Kopplad utrustning</Label>
              <Select value={form.equipment_id} onValueChange={handleEquipmentChange}>
                <SelectTrigger><SelectValue placeholder="Välj..." /></SelectTrigger>
                <SelectContent>
                  {equipment.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Rapporterad till</Label>
              <Select value={form.reported_to} onValueChange={(v) => set("reported_to", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Intern</SelectItem>
                  <SelectItem value="ssm">SSM</SelectItem>
                  <SelectItem value="ivo">IVO</SelectItem>
                  <SelectItem value="both">SSM & IVO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Öppen</SelectItem>
                  <SelectItem value="under_investigation">Under utredning</SelectItem>
                  <SelectItem value="closed">Avslutad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.status === "closed" && (
              <div className="space-y-1.5">
                <Label>Avslutsdatum</Label>
                <Input type="date" value={form.closed_date} onChange={(e) => set("closed_date", e.target.value)} />
              </div>
            )}
            <div className="col-span-2 space-y-1.5">
              <Label>Åtgärd</Label>
              <Textarea value={form.corrective_action} onChange={(e) => set("corrective_action", e.target.value)} rows={2} placeholder="Beskriv vidtagen eller planerad åtgärd..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={() => onSave(form)} disabled={!form.incident_date || !form.description}>Spara</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}