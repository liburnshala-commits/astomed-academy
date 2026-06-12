import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import ModuleStatusBadge from "./ModuleStatusBadge";

export default function ModuleRow({ module, onEdit, onDelete, onStatusChange }) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="font-medium">
        <span className="text-muted-foreground mr-2">{String(module.module_number).padStart(2, "0")}.</span>
        {module.title}
      </TableCell>
      <TableCell>
        <ModuleStatusBadge status={module.status} />
      </TableCell>
      <TableCell>
        <Select
          value={module.script_status || "not_started"}
          onValueChange={(v) => onStatusChange(module.id, "script_status", v)}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Ej påbörjad</SelectItem>
            <SelectItem value="in_progress">Pågår</SelectItem>
            <SelectItem value="done">Klar</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={module.recording_status || "not_started"}
          onValueChange={(v) => onStatusChange(module.id, "recording_status", v)}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Ej påbörjad</SelectItem>
            <SelectItem value="scheduled">Planerad</SelectItem>
            <SelectItem value="done">Klar</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={module.pdf_status || "not_started"}
          onValueChange={(v) => onStatusChange(module.id, "pdf_status", v)}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_started">Ej påbörjad</SelectItem>
            <SelectItem value="in_progress">Pågår</SelectItem>
            <SelectItem value="done">Klar</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="font-medium">
        {module.price ? `${module.price} kr` : "–"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(module)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(module.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}