import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import AuditForm from "./AuditForm";

const statusConfig = {
  open: { label: "Öppen", color: "bg-amber-100 text-amber-800" },
  completed: { label: "Genomförd", color: "bg-green-100 text-green-800" },
};

export default function AuditTab({ audits }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const handleSave = async (data) => {
    if (editItem) {
      await base44.entities.AuditLog.update(editItem.id, data);
    } else {
      await base44.entities.AuditLog.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ["audits"] });
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Ta bort denna revision?")) return;
    await base44.entities.AuditLog.delete(id);
    queryClient.invalidateQueries({ queryKey: ["audits"] });
  };

  const handleMarkCompleted = async (audit) => {
    await base44.entities.AuditLog.update(audit.id, { status: "completed" });
    queryClient.invalidateQueries({ queryKey: ["audits"] });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading font-semibold">Internrevision / Egenkontroll</h2>
        <Button size="sm" className="gap-2" onClick={() => { setEditItem(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" />
          Ny revision
        </Button>
      </div>

      {audits.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Inga revisioner registrerade ännu.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {audits.map((audit) => {
            const status = statusConfig[audit.status] || statusConfig.open;
            const deadlineOverdue = audit.action_required && audit.action_deadline &&
              differenceInDays(parseISO(audit.action_deadline), new Date()) < 0 && audit.status !== "completed";

            return (
              <div key={audit.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{audit.scope}</span>
                    <Badge className={`text-[10px] border-0 ${status.color}`}>{status.label}</Badge>
                    {audit.action_required && audit.status !== "completed" && (
                      <Badge className="text-[10px] border-0 bg-red-100 text-red-800">Åtgärd krävs</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span>{format(parseISO(audit.audit_date), "d MMM yyyy")}</span>
                    <span>Genomförd av: {audit.conducted_by}</span>
                    {audit.next_audit_date && (
                      <span>Nästa revision: {format(parseISO(audit.next_audit_date), "d MMM yyyy")}</span>
                    )}
                  </div>
                  {audit.findings && (
                    <p className="text-sm text-muted-foreground">{audit.findings}</p>
                  )}
                  {audit.action_description && (
                    <div className={`flex items-start gap-1.5 text-xs rounded px-2 py-1 mt-1 ${deadlineOverdue ? "bg-red-50 text-red-700" : "bg-muted/50 text-muted-foreground"}`}>
                      {deadlineOverdue && <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                      <span>
                        <span className="font-medium">Åtgärd:</span> {audit.action_description}
                        {audit.action_deadline && ` — deadline ${format(parseISO(audit.action_deadline), "d MMM yyyy")}`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {audit.status === "open" && (
                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleMarkCompleted(audit)} title="Markera som genomförd">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => { setEditItem(audit); setShowForm(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(audit.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <AuditForm
          open={showForm}
          item={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}