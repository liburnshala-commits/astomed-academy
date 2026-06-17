import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaults = { name: "", type: "laser", serial_number: "", manufacturer: "", purchase_date: "", next_service_date: "", risk_class: "", status: "active", notes: "" };

export default function EquipmentForm({ open, onClose, onSave, item }) {
  const [form, setForm] = useState(item ? { ...defaults, ...item } : defaults);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? "Redigera utrustning" : "Lägg till utrustning"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Namn *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="t.ex. Alexandrit Laser Candela" />
            </div>
            <div className="space-y-1.5">
              <Label>Typ *</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="laser">Laser</SelectItem>
                  <SelectItem value="ipl">IPL</SelectItem>
                  <SelectItem value="co2">CO₂</SelectItem>
                  <SelectItem value="rf">RF</SelectItem>
                  <SelectItem value="other">Annan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Riskklass</Label>
              <Select value={form.risk_class} onValueChange={(v) => set("risk_class", v)}>
                <SelectTrigger><SelectValue placeholder="Välj..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="class_3b">Klass 3B</SelectItem>
                  <SelectItem value="class_4">Klass 4</SelectItem>
                  <SelectItem value="ipl">IPL</SelectItem>
                  <SelectItem value="co2">CO₂</SelectItem>
                  <SelectItem value="other">Annan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tillverkare</Label>
              <Input value={form.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} placeholder="t.ex. Candela" />
            </div>
            <div className="space-y-1.5">
              <Label>Serienummer</Label>
              <Input value={form.serial_number} onChange={(e) => set("serial_number", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Inköpsdatum</Label>
              <Input type="date" value={form.purchase_date} onChange={(e) => set("purchase_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Nästa service</Label>
              <Input type="date" value={form.next_service_date} onChange={(e) => set("next_service_date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="under_service">På service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button onClick={() => onSave(form)} disabled={!form.name}>Spara</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}