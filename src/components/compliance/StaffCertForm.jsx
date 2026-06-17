import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaults = { staff_name: "", equipment_id: "", equipment_name: "", certification_name: "", issued_date: "", expiry_date: "", issued_by: "", certificate_url: "" };

export default function StaffCertForm({ open, onClose, onSave, equipment }) {
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
          <DialogTitle>Lägg till certifikat / behörighet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Personalens namn *</Label>
              <Input value={form.staff_name} onChange={(e) => set("staff_name", e.target.value)} placeholder="Förnamn Efternamn" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Certifikat / utbildning *</Label>
              <Input value={form.certification_name} onChange={(e) => set("certification_name", e.target.value)} placeholder="t.ex. SSM-utbildning Klass 4 Laser" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Kopplad utrustning (valfritt)</Label>
              <Select value={form.equipment_id} onValueChange={handleEquipmentChange}>
                <SelectTrigger><SelectValue placeholder="Välj utrustning..." /></SelectTrigger>
                <SelectContent>
                  {equipment.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Utfärdandedatum *</Label>
              <Input type="date" value={form.issued_date} onChange={(e) => set("issued_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Utgångsdatum</Label>
              <Input type="date" value={form.expiry_date} onChange={(e) => set("expiry_date", e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Utfärdad av</Label>
              <Input value={form.issued_by} onChange={(e) => set("issued_by", e.target.value)} placeholder="t.ex. SSM, kursarrangör" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Länk till intyg (URL)</Label>
              <Input value={form.certificate_url} onChange={(e) => set("certificate_url", e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={() => onSave(form)} disabled={!form.staff_name || !form.certification_name || !form.issued_date}>Spara</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}