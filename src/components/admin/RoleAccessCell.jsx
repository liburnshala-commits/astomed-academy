import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const ROLES = [
  { value: "verksamhetsutovare", label: "Verksamhetsutövare" },
  { value: "medicinskt_ansvarig_lakare", label: "Medicinskt ansvarig" },
  { value: "behandlare", label: "Behandlare" },
  { value: "teknisk_ansvarig", label: "Teknisk ansvarig" },
  { value: "allman_personal", label: "Allmän personal" },
];

export default function RoleAccessCell({ module, onChange }) {
  const [open, setOpen] = useState(false);
  const roles = module.target_roles || [];

  const toggle = (value) => {
    const next = roles.includes(value)
      ? roles.filter((r) => r !== value)
      : [...roles, value];
    onChange(module.id, "target_roles", next);
  };

  const summary =
    roles.length === 0 ? "Ingen roll" : `${roles.length} ${roles.length === 1 ? "roll" : "roller"}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-8 gap-1.5 text-xs ${roles.length > 0 ? "border-accent/40 text-accent" : "text-muted-foreground"}`}
        >
          <Users className="w-3.5 h-3.5" />
          {summary}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60" align="start">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Tillgänglig för
        </p>
        <div className="space-y-0.5">
          {ROLES.map((r) => {
            const checked = roles.includes(r.value);
            return (
              <label
                key={r.value}
                className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/40 cursor-pointer"
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(r.value)} />
                <span className="text-sm font-body">{r.label}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}