import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const defaults = { equipment_id: "", equipment_name: "", service_date: "", service_type: "maintenance", performed_by: "", next_service_date: "", notes: "", document_url: "" };

export default function ServiceLogForm({ open, onClose, onSave, equipment }) {
  const [form, setForm] = useState(defaults);
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
          <DialogTitle>Ny servicepost</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Utrustning *</Label>
              <Select value={form.equipment_id} onValueChange={handleEquipmentChange}>
                <SelectTrigger><SelectValue placeholder="Välj utrustning..." /></SelectTrigger>
                <SelectContent>
                  {equipment.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Servicetyp *</Label>
              <Select value={form.service_type} onValueChange={(v) => set("service_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="calibration">Kalibrering</SelectItem>
                  <SelectItem value="maintenance">Underhåll</SelectItem>
                  <SelectItem value="repair">Reparation</SelectItem>
                  <SelectItem value="inspection">Inspektion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Servicedatum *</Label>
              <Input type="date" value={form.service_date} onChange={(e) => set("service_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Utförd av</Label>
              <Input value={form.performed_by} onChange={(e) => set("performed_by", e.target.value)} placeholder="Namn / företag" />
            </div>
            <div className="space-y-1.5">
              <Label>Nästa service</Label>
              <Input type="date" value={form.next_service_date} onChange={(e) => set("next_service_date", e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Anteckningar</Label>
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Länk till protokoll (URL)</Label>
              <Input value={form.document_url} onChange={(e) => set("document_url", e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={() => onSave(form)} disabled={!form.equipment_id || !form.service_date}>Spara</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}