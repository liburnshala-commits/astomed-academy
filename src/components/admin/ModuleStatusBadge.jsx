import React from "react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  not_started: { label: "Ej påbörjad", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "Pågår", className: "bg-accent/20 text-accent-foreground" },
  done: { label: "Klar", className: "bg-green-100 text-green-800" },
  draft: { label: "Utkast", className: "bg-muted text-muted-foreground" },
  script_ready: { label: "Manus klart", className: "bg-blue-100 text-blue-800" },
  recorded: { label: "Inspelad", className: "bg-purple-100 text-purple-800" },
  editing: { label: "Redigering", className: "bg-amber-100 text-amber-800" },
  published: { label: "Publicerad", className: "bg-green-100 text-green-800" },
  scheduled: { label: "Planerad", className: "bg-blue-100 text-blue-800" },
};

export default function ModuleStatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <Badge className={`${config.className} border-0 text-[10px] uppercase tracking-wider font-semibold`}>
      {config.label}
    </Badge>
  );
}