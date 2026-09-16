import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RequestAccess() {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    org_number: "",
    notes: ""
  });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("https://unnatural-service-track-pro.base44.app/functions/createAcademyLead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto p-8 text-center mt-10 bg-white rounded-xl border">
        <h2 className="text-2xl font-bold text-green-600 mb-3">Tack för din ansökan!</h2>
        <p className="text-gray-600">
          Vi har tagit emot dina uppgifter. Astomed kommer att hantera din förfrågan manuellt och återkomma till dig med åtkomst.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-2">Ansök om åtkomst</h2>
      <p className="text-sm text-gray-500 mb-6">Fyll i formuläret nedan för att få tillgång till Astomed Academy.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Företagsnamn *</label>
          <Input required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kontaktperson *</label>
          <Input required value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">E-post *</label>
          <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefonnummer *</label>
          <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Organisationsnummer</label>
          <Input value={formData.org_number} onChange={e => setFormData({...formData, org_number: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Övrigt</label>
          <Textarea 
            value={formData.notes} 
            onChange={e => setFormData({...formData, notes: e.target.value})} 
            placeholder="Eventuella meddelanden..." 
          />
        </div>
        
        <Button type="submit" className="w-full mt-2" disabled={status === "loading"}>
          {status === "loading" ? "Skickar..." : "Skicka ansökan"}
        </Button>
        {status === "error" && (
          <p className="text-red-500 text-sm mt-2 text-center">Något gick fel, vänligen försök igen.</p>
        )}
      </form>
    </div>
  );
}