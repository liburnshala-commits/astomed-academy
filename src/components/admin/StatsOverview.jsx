import React from "react";
import { BookOpen, CheckCircle2, Clock, FileText } from "lucide-react";

export default function StatsOverview({ modules }) {
  const total = modules.length;
  const scriptsDone = modules.filter((m) => m.script_status === "done").length;
  const recorded = modules.filter((m) => m.recording_status === "done").length;
  const published = modules.filter((m) => m.status === "published").length;

  const stats = [
    { label: "Totalt moduler", value: total, icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Manus klara", value: `${scriptsDone}/${total}`, icon: FileText, color: "bg-blue-50 text-blue-600" },
    { label: "Inspelade", value: `${recorded}/${total}`, icon: Clock, color: "bg-purple-50 text-purple-600" },
    { label: "Publicerade", value: `${published}/${total}`, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-xl border border-border/50 p-5">
          <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon className="w-4.5 h-4.5" />
          </div>
          <p className="text-2xl font-bold font-heading text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}