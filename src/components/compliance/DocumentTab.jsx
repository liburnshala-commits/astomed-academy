import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, AlertTriangle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import DocumentForm from "./DocumentForm";

const categoryLabels = {
  ledningssystem: "Ledningssystem",
  rutiner: "Rutiner",
  samtycke: "Samtycke",
  riskbedomning: "Riskbedömning",
  egenkontroll: "Egenkontroll",
  hygien: "Hygien",
};

const categoryColors = {
  ledningssystem: "bg-blue-100 text-blue-800",
  rutiner: "bg-green-100 text-green-800",
  samtycke: "bg-purple-100 text-purple-800",
  riskbedomning: "bg-red-100 text-red-800",
  egenkontroll: "bg-amber-100 text-amber-800",
  hygien: "bg-teal-100 text-teal-800",
};

const statusConfig = {
  current: { label: "Aktuell", color: "bg-green-100 text-green-800" },
  needs_review: { label: "Behöver granskas", color: "bg-amber-100 text-amber-800" },
  expired: { label: "Utgången", color: "bg-red-100 text-red-800" },
};

export default function DocumentTab({ documents }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const handleSave = async (data) => {
    if (editItem) {
      await base44.entities.ComplianceDocument.update(editItem.id, data);
    } else {
      await base44.entities.ComplianceDocument.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ["complianceDocs"] });
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Ta bort detta dokument?")) return;
    await base44.entities.ComplianceDocument.delete(id);
    queryClient.invalidateQueries({ queryKey: ["complianceDocs"] });
  };

  const getValidityWarning = (doc) => {
    if (!doc.valid_until) return null;
    const days = differenceInDays(parseISO(doc.valid_until), new Date());
    if (days < 0) return "Utgången";
    if (days <= 30) return `Löper ut om ${days} dagar`;
    return null;
  };

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading font-semibold">Dokumentbank</h2>
        <Button size="sm" className="gap-2" onClick={() => { setEditItem(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" />
          Lägg till dokument
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Inga dokument uppladdade ännu.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {documents.map((doc) => {
            const warning = getValidityWarning(doc);
            const status = statusConfig[doc.status] || statusConfig.current;
            return (
              <div key={doc.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{doc.title}</span>
                    <Badge className={`text-[10px] border-0 ${categoryColors[doc.category]}`}>
                      {categoryLabels[doc.category]}
                    </Badge>
                    <Badge className={`text-[10px] border-0 ${status.color}`}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {doc.valid_from && <span>Från: {format(parseISO(doc.valid_from), "d MMM yyyy")}</span>}
                    {doc.valid_until && <span>Till: {format(parseISO(doc.valid_until), "d MMM yyyy")}</span>}
                    {doc.reviewed_by && <span>Granskad av: {doc.reviewed_by}</span>}
                  </div>
                  {warning && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium mt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {warning}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {doc.document_url && (
                    <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><FileText className="w-4 h-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => { setEditItem(doc); setShowForm(true); }}>
                    <span className="sr-only">Redigera</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z" /></svg>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <DocumentForm
          open={showForm}
          item={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}