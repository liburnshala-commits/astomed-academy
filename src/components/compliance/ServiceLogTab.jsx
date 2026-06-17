import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import ServiceLogForm from "./ServiceLogForm";

const typeLabels = { calibration: "Kalibrering", maintenance: "Underhåll", repair: "Reparation", inspection: "Inspektion" };
const typeColors = { calibration: "bg-blue-100 text-blue-800", maintenance: "bg-green-100 text-green-800", repair: "bg-red-100 text-red-800", inspection: "bg-purple-100 text-purple-800" };

export default function ServiceLogTab({ serviceLogs, equipment }) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async (data) => {
    await base44.entities.ServiceLog.create(data);
    queryClient.invalidateQueries({ queryKey: ["serviceLogs"] });
    queryClient.invalidateQueries({ queryKey: ["equipment"] });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Ta bort detta serviceprotokoll?")) return;
    await base44.entities.ServiceLog.delete(id);
    queryClient.invalidateQueries({ queryKey: ["serviceLogs"] });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading font-semibold">Servicelogg</h2>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Ny servicepost
        </Button>
      </div>

      {serviceLogs.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Inga serviceposter registrerade ännu.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {serviceLogs.map((log) => (
            <div key={log.id} className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{log.equipment_name || "Okänd utrustning"}</span>
                  <Badge className={`text-[10px] border-0 ${typeColors[log.service_type]}`}>
                    {typeLabels[log.service_type]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>{log.service_date ? format(parseISO(log.service_date), "d MMM yyyy") : "–"}</span>
                  {log.performed_by && <span>Utförd av: {log.performed_by}</span>}
                  {log.next_service_date && <span>Nästa: {format(parseISO(log.next_service_date), "d MMM yyyy")}</span>}
                </div>
                {log.notes && <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {log.document_url && (
                  <a href={log.document_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon"><FileText className="w-4 h-4" /></Button>
                  </a>
                )}
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(log.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ServiceLogForm
          open={showForm}
          equipment={equipment}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}