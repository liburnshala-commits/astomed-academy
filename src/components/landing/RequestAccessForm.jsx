import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function RequestAccessForm({ compact = false }) {
  const [formData, setFormData] = useState({
    clinic: "",
    full_name: "",
    email: "",
    phone: "",
    org_number: "",
    equipment_type: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.AcademyRegistration.create({
        ...formData,
        forwarded: false
      });
      setSubmitted(true);
      toast({
        title: "Ansökan mottagen",
        description: "Vi har tagit emot dina uppgifter och återkommer inom kort.",
      });
    } catch (error) {
      toast({
        title: "Något gick fel",
        description: error.message || "Kunde inte skicka ansökan. Försök igen senare.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">Tack för din ansökan!</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Vi har tagit emot dina uppgifter. Astomed hanterar din förfrågan och återkommer med åtkomst till Academy.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setFormData({ clinic: "", full_name: "", email: "", phone: "", org_number: "", equipment_type: "", message: "" });
          }}
        >
          Skicka en till ansökan
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div className="space-y-1.5">
          <Label htmlFor="clinic" className="text-sm font-medium">Företagsnamn *</Label>
          <Input
            id="clinic"
            required
            value={formData.clinic}
            onChange={handleChange("clinic")}
            placeholder="Din klinik AB"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-sm font-medium">Kontaktperson *</Label>
          <Input
            id="full_name"
            required
            value={formData.full_name}
            onChange={handleChange("full_name")}
            placeholder="För- och efternamn"
          />
        </div>
      </div>

      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">E-post *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="namn@klinik.se"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">Telefon *</Label>
          <Input
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="070-123 45 67"
          />
        </div>
      </div>

      <div className={compact ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div className="space-y-1.5">
          <Label htmlFor="org_number" className="text-sm font-medium">Organisationsnummer *</Label>
          <Input
            id="org_number"
            required
            value={formData.org_number}
            onChange={handleChange("org_number")}
            placeholder="556123-4567"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="equipment_type" className="text-sm font-medium">Utrustningstyp</Label>
          <Input
            id="equipment_type"
            value={formData.equipment_type}
            onChange={handleChange("equipment_type")}
            placeholder="Laser, IPL, RF..."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium">Meddelande</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={handleChange("message")}
          placeholder="Eventuella frågor eller meddelanden..."
          rows={compact ? 3 : 4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Skickar...
          </>
        ) : (
          "Ansök om åtkomst"
        )}
      </Button>
    </form>
  );
}