import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, Building2, User, Mail, Phone, Hash, MapPin, Wrench, MessageSquare } from "lucide-react";

const inputBase =
  "w-full h-10 px-3 rounded-[6px] border border-[#212d40] bg-[#0b0f17] text-[#f8fafc] placeholder:text-[#64748b]/50 text-sm font-medium focus:outline-none focus:border-[#00f2fe] transition-colors";

export default function RegistrationForm({ onSubmitted }) {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", clinic: "", org_number: "",
    address: "", city: "", equipment_type: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        org_number: form.org_number.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        equipment_type: form.equipment_type.trim(),
        message: form.message.trim(),
      });
      setForm({ full_name: "", email: "", phone: "", clinic: "", org_number: "", address: "", city: "", equipment_type: "", message: "" });
      toast({ title: "Anmälan mottagen", description: "Lead vidarebefordras till serviceastomed." });
      onSubmitted?.();
    } catch (err) {
      toast({ variant: "destructive", title: "Något gick fel", description: "Försök igen senare." });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = [
    { name: "clinic", label: "Klinik / Företag", icon: Building2, placeholder: "Klinikens namn" },
    { name: "full_name", label: "Kontaktperson *", icon: User, placeholder: "För- och efternamn", required: true },
    { name: "email", label: "E-post *", icon: Mail, placeholder: "namn@klinik.se", type: "email", required: true },
    { name: "phone", label: "Telefon", icon: Phone, placeholder: "070-123 45 67" },
    { name: "org_number", label: "Org.nummer", icon: Hash, placeholder: "556xxx-xxxx" },
    { name: "address", label: "Adress", icon: MapPin, placeholder: "Gatuadress" },
    { name: "city", label: "Ort", placeholder: "Stad" },
    { name: "equipment_type", label: "Utrustningstyp", icon: Wrench, placeholder: "Laser, IPL, RF..." },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-[#212d40] shrink-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#00f2fe] mb-1 font-body-telemetry">Academy Registration</p>
        <h2 className="text-xl font-bold text-[#f8fafc] font-display-telemetry">Anmäl din klinik</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] mb-1.5 flex items-center gap-1.5 font-body-telemetry">
              {f.icon && <f.icon className="w-3 h-3" />}
              {f.label}
            </label>
            <input
              name={f.name}
              type={f.type || "text"}
              value={form[f.name]}
              onChange={handleChange}
              required={f.required}
              placeholder={f.placeholder}
              className={inputBase + " font-body-telemetry"}
            />
          </div>
        ))}

        <div>
          <label className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] mb-1.5 flex items-center gap-1.5 font-body-telemetry">
            <MessageSquare className="w-3 h-3" />
            Meddelande / Noter
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Frivilligt meddelande"
            rows={3}
            className={inputBase + " py-2 resize-none font-body-telemetry"}
          />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[#212d40] shrink-0">
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-10 rounded-[6px] bg-[#00f2fe] text-[#0b0f17] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#00f2fe]/90 transition-all disabled:opacity-50 font-body-telemetry"
          style={submitting ? { boxShadow: "0 0 20px rgba(0,242,254,0.4)" } : {}}
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Skickar...</>
          ) : (
            <><Send className="w-4 h-4" /> Skicka anmälan</>
          )}
        </button>
      </div>
    </form>
  );
}