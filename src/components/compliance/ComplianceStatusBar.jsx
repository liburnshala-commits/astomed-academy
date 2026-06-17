import React from "react";
import { AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  return differenceInDays(parseISO(dateStr), new Date());
}

export default function ComplianceStatusBar({ equipment, serviceLogs, certifications, documents = [], incidents = [] }) {
  const today = new Date();

  // Equipment expiring service within 30 days or overdue
  const serviceWarnings = equipment.filter((e) => {
    if (!e.next_service_date) return false;
    return getDaysUntil(e.next_service_date) <= 30;
  });

  // Certifications expiring within 60 days or overdue
  const certWarnings = certifications.filter((c) => {
    if (!c.expiry_date) return false;
    return getDaysUntil(c.expiry_date) <= 60;
  });

  // Documents expiring within 30 days or expired
  const docWarnings = documents.filter((d) => {
    if (!d.valid_until) return false;
    return getDaysUntil(d.valid_until) <= 30;
  });

  // Open incidents
  const openIncidents = incidents.filter((i) => i.status !== "closed");

  const totalWarnings = serviceWarnings.length + certWarnings.length + docWarnings.length + openIncidents.length;
  const overallStatus = totalWarnings === 0 ? "green" : totalWarnings <= 2 ? "yellow" : "red";

  const statusConfig = {
    green: { label: "Kliniken är tillsynsklar", color: "bg-green-50 border-green-200 text-green-800", icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
    yellow: { label: "Några punkter kräver uppmärksamhet", color: "bg-amber-50 border-amber-200 text-amber-800", icon: <Clock className="w-5 h-5 text-amber-600" /> },
    red: { label: "Åtgärder krävs innan tillsyn", color: "bg-red-50 border-red-200 text-red-800", icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
  };

  const s = statusConfig[overallStatus];

  const stats = [
    { label: "Aktiva maskiner", value: equipment.filter((e) => e.status === "active").length, icon: <Wrench className="w-4 h-4" />, color: "text-accent" },
    { label: "Service varningar", value: serviceWarnings.length, icon: <Clock className="w-4 h-4" />, color: serviceWarnings.length > 0 ? "text-amber-600" : "text-green-600" },
    { label: "Certifikat varningar", value: certWarnings.length, icon: <AlertTriangle className="w-4 h-4" />, color: certWarnings.length > 0 ? "text-red-600" : "text-green-600" },
    { label: "Personal registrerad", value: [...new Set(certifications.map((c) => c.staff_name))].length, icon: <CheckCircle className="w-4 h-4" />, color: "text-foreground" },
  ];

  return (
    <div className="space-y-4">
      {/* Overall status */}
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${s.color}`}>
        {s.icon}
        <div>
          <p className="font-semibold text-sm">{s.label}</p>
          {totalWarnings > 0 && (
            <p className="text-xs mt-0.5 opacity-80">{totalWarnings} punkt{totalWarnings > 1 ? "er" : ""} behöver åtgärdas</p>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border/50 p-4 flex items-center gap-3">
            <div className={`${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-heading font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}