import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import IncidentForm from "./IncidentForm";

const typeLabels = { patient_injury: "Patientskada", near_miss: "Tillbud", equipment_fault: "Utrustningsfel", complaint: "Klagomål" };
const typeColors = { patient_injury: "bg-red-100 text-red-800", near_miss: "bg-amber-100 text-amber-800", equipment_fault: "bg-orange-100 text-orange-800", complaint: "bg-purple-100 text-purple-800" };
const reportedLabels = { ssm: "SSM", ivo: "IVO", both: "SSM & IVO", internal: "Intern" };
const statusConfig = {
  open: { label: "Öppen", color: "bg-red-100 text-red-800" },
  under_investigation: { label: "Under utredning", color: "bg-amber-100 text-amber-800" },
  closed: { label: "Avslutad", color: "bg-green-100 text-green-800" },
};

export default function IncidentTab({ incidents, equipment }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const handleSave = async (data) => {
    if (editItem) {
      await base44.entities.Incident.update(editItem.id, data);
    } else {
      await base44.entities.Incident.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ["incidents"] });
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Ta bort denna avvikelse?")) return;
    await base44.entities.Incident.delete(id);
    queryClient.invalidateQueries({ queryKey: ["incidents"] });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading font-semibold">Avvikelselogg</h2>
        <Button size="sm" className="gap-2" onClick={() => { setEditItem(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" />
          Ny avvikelse
        </Button>
      </div>

      {incidents.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Inga avvikelser registrerade.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {incidents.map((inc) => {
            const status = statusConfig[inc.status] || statusConfig.open;
            return (
              <div key={inc.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`text-[10px] border-0 ${typeColors[inc.type]}`}>{typeLabels[inc.type]}</Badge>
                    <Badge className={`text-[10px] border-0 ${status.color}`}>{status.label}</Badge>
                    <span className="text-xs text-muted-foreground">Rapporterad till: {reportedLabels[inc.reported_to]}</span>
                  </div>
                  <p className="text-sm">{inc.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {inc.incident_date && <span>{format(parseISO(inc.incident_date), "d MMM yyyy")}</span>}
                    {inc.equipment_name && <span>Utrustning: {inc.equipment_name}</span>}
                  </div>
                  {inc.corrective_action && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 mt-1">
                      <span className="font-medium">Åtgärd:</span> {inc.corrective_action}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => { setEditItem(inc); setShowForm(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(inc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <IncidentForm
          open={showForm}
          item={editItem}
          equipment={equipment}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}