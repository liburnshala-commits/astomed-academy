import React from "react";

const ROLES = [
  { value: "verksamhetsutovare", label: "V. utövare", full: "Verksamhetsutövare" },
  { value: "medicinskt_ansvarig_lakare", label: "M. ansvarig", full: "Medicinskt ansvarig" },
  { value: "behandlare", label: "Behandlare", full: "Behandlare" },
  { value: "teknisk_ansvarig", label: "T. ansvarig", full: "Teknisk ansvarig" },
  { value: "allman_personal", label: "Allmän", full: "Allmän personal" },
];

export default function RoleAccessCell({ module, onChange }) {
  const roles = module.target_roles || [];

  const toggle = (value) => {
    const next = roles.includes(value)
      ? roles.filter((r) => r !== value)
      : [...roles, value];
    onChange(module.id, "target_roles", next);
  };

  return (
    <div className="flex flex-wrap gap-1 max-w-[220px]">
      {ROLES.map((r) => {
        const active = roles.includes(r.value);
        return (
          <button
            key={r.value}
            type="button"
            title={r.full}
            onClick={() => toggle(r.value)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
              active
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-muted/30 text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}