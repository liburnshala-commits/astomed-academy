import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";
import EquipmentForm from "./EquipmentForm";

const typeLabels = { laser: "Laser", ipl: "IPL", co2: "CO₂", rf: "RF", other: "Annan" };
const riskLabels = { class_3b: "Klass 3B", class_4: "Klass 4", ipl: "IPL", co2: "CO₂", other: "Annan" };
const statusColors = { active: "bg-green-100 text-green-800", inactive: "bg-gray-100 text-gray-600", under_service: "bg-amber-100 text-amber-800" };
const statusLabels = { active: "Aktiv", inactive: "Inaktiv", under_service: "På service" };

export default function EquipmentTab({ equipment }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const queryClient = useQueryClient();

  const handleSave = async (data) => {
    if (editItem) {
      await base44.entities.Equipment.update(editItem.id, data);
    } else {
      await base44.entities.Equipment.create(data);
    }
    queryClient.invalidateQueries({ queryKey: ["equipment"] });
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Är du säker på att du vill ta bort denna utrustning?")) return;
    await base44.entities.Equipment.delete(id);
    queryClient.invalidateQueries({ queryKey: ["equipment"] });
  };

  const getDaysUntilService = (dateStr) => {
    if (!dateStr) return null;
    return differenceInDays(parseISO(dateStr), new Date());
  };

  return (
    <div className="bg-card rounded-xl border border-border/50">
      <div className="p-5 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-heading font-semibold">Utrustningsregister</h2>
        <Button size="sm" className="gap-2" onClick={() => { setEditItem(null); setShowForm(true); }}>
          <Plus className="w-4 h-4" />
          Lägg till utrustning
        </Button>
      </div>

      {equipment.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Ingen utrustning registrerad ännu.
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {equipment.map((item) => {
            const daysLeft = getDaysUntilService(item.next_service_date);
            const serviceWarning = daysLeft !== null && daysLeft <= 30;
            return (
              <div key={item.id} className="p-5 flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{item.name}</span>
                    <Badge className={`text-[10px] border-0 ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </Badge>
                    {item.risk_class && (
                      <Badge variant="outline" className="text-[10px]">{riskLabels[item.risk_class]}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span>{typeLabels[item.type]}</span>
                    {item.manufacturer && <span>{item.manufacturer}</span>}
                    {item.serial_number && <span>S/N: {item.serial_number}</span>}
                  </div>
                  {item.next_service_date && (
                    <div className={`flex items-center gap-1.5 text-xs mt-1 ${serviceWarning ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                      {serviceWarning && <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>
                        Nästa service: {format(parseISO(item.next_service_date), "d MMM yyyy")}
                        {daysLeft < 0 ? " (förfallen!)" : daysLeft <= 30 ? ` (om ${daysLeft} dagar)` : ""}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => { setEditItem(item); setShowForm(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <EquipmentForm
          open={showForm}
          item={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}