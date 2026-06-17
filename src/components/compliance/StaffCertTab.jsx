import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Download, AlertTriangle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import StaffCertForm from "./StaffCertForm";

export default function StaffCertTab({ certifications, equipment }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async (data) => {
    await base44.entities.StaffCertification.create(data);
    queryClient.invalidateQueries({ queryKey: ["certifications"] });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Ta bort detta certifikat?")) return;
    await base44.entities.StaffCertification.delete(id);
    queryClient.invalidateQueries({ queryKey: ["certifications"] });
  };

  const getExpiryStatus = (dateStr) => {
    if (!dateStr) return null;
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: "Utgånget", color: "bg-red-100 text-red-800", warn: true };
    if (days <= 60) return { label: `Löper ut om ${days} dagar`, color: "bg-amber-100 text-amber-800", warn: true };
    return { label: `Giltigt t.o.m. ${format(parseISO(dateStr), "d MMM yyyy")}`, color: "bg-green-100 text-green-800", warn: false };
  };

  // Group by staff name
  const byStaff = certifications.reduce((acc, cert) => {
    if (!acc[cert.staff_name]) acc[cert.staff_name] = [];
    acc[cert.staff_name].push(cert);
    return acc;
  }, {});

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading font-semibold">Personal & behörigheter</h2>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Lägg till certifikat
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Inga certifikat registrerade ännu.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {Object.entries(byStaff).map(([name, certs]) => (
            <div key={name} className="p-5 space-y-3">
              <p className="font-medium">{name}</p>
              <div className="space-y-2 pl-2">
                {certs.map((cert) => {
                  const expiry = getExpiryStatus(cert.expiry_date);
                  return (
                    <div key={cert.id} className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm">{cert.certification_name}</span>
                          {expiry && (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${expiry.color}`}>
                              {expiry.warn && <AlertTriangle className="w-3 h-3" />}
                              {expiry.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {cert.equipment_name && <span>Maskin: {cert.equipment_name}</span>}
                          {cert.issued_by && <span>Utfärdad av: {cert.issued_by}</span>}
                          {cert.issued_date && <span>{format(parseISO(cert.issued_date), "d MMM yyyy")}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {cert.certificate_url && (
                          <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                          </a>
                        )}
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(cert.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <StaffCertForm
          open={showForm}
          equipment={equipment}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}