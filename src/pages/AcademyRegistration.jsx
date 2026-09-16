import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Loader2, User, Mail, Phone, Building2, MapPin, Wrench } from "lucide-react";

export default function AcademyRegistration() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    clinic: "",
    address: "",
    city: "",
    equipment_type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.AcademyRegistration.create({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        clinic: form.clinic.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        equipment_type: form.equipment_type.trim(),
        message: form.message.trim(),
      });
      setDone(true);
      setForm({ full_name: "", email: "", phone: "", clinic: "", address: "", city: "", equipment_type: "", message: "" });
      toast({ title: "Anmälan mottagen", description: "Vi hör av oss inom kort." });
    } catch (err) {
      toast({ variant: "destructive", title: "Något gick fel", description: "Försök igen senare." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 pt-20 pb-12">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground mb-2">Tack för din anmälan!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Vi har tagit emot dina uppgifter och hör av oss med mer information inom kort.
          </p>
          <Button onClick={() => setDone(false)} variant="outline" className="font-body">
            Gör en ny anmälan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-body font-semibold uppercase tracking-widest text-accent mb-2">
            Serviceavtal
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
            Anmäl din klinik
          </h1>
          <p className="mt-3 font-body text-muted-foreground leading-relaxed">
            Fyll i formuläret så kontaktar vi dig med mer information om vårt serviceavtal.
            Dina uppgifter skickas säkert till vår kundportal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="font-body text-sm font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Kontaktperson *
            </Label>
            <Input
              id="full_name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="För- och efternamn"
              className="font-body"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> E-post *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="namn@klinik.se"
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-body text-sm font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Telefon
              </Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="070-123 45 67"
                className="font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinic" className="font-body text-sm font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Klinik
            </Label>
            <Input
              id="clinic"
              name="clinic"
              value={form.clinic}
              onChange={handleChange}
              placeholder="Klinikens namn"
              className="font-body"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="address" className="font-body text-sm font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Adress
              </Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Gatuadress"
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="font-body text-sm font-medium">
                Ort
              </Label>
              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Stad"
                className="font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment_type" className="font-body text-sm font-medium flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Utrustningstyp
            </Label>
            <Input
              id="equipment_type"
              name="equipment_type"
              value={form.equipment_type}
              onChange={handleChange}
              placeholder="T.ex. Laser, IPL, RF, HIFU..."
              className="font-body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="font-body text-sm font-medium">
              Meddelande
            </Label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Frivilligt meddelande"
              rows={4}
              className="font-body resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full font-body font-medium bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Skickar...
              </>
            ) : (
              "Skicka anmälan"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}