import React from "react";
import { CheckCircle2, Globe, Code2, ArrowRight } from "lucide-react";

const statusCards = [
  { label: "Endpoint", value: "createAcademyLead", status: "deployed", icon: Code2 },
  { label: "Target URL", value: "unnatural-service-track-pro", status: "ready", icon: Globe },
  { label: "Schema", value: "6 fields mapped", status: "validated", icon: CheckCircle2 },
];

const mappedFields = [
  { from: "clinic", to: "company_name" },
  { from: "full_name", to: "contact_person" },
  { from: "email", to: "email" },
  { from: "phone", to: "phone" },
  { from: "org_number", to: "org_number" },
  { from: "address+city+equip+msg", to: "notes" },
];

export default function EndpointStatusGrid() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {statusCards.map((c) => (
          <div key={c.label} className="rounded-[6px] border border-[#212d40] bg-[#131a26] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] font-body-telemetry">{c.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] font-body-telemetry">{c.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <c.icon className="w-4 h-4 text-[#00f2fe] shrink-0" />
              <span className="text-sm text-[#f8fafc] font-medium font-mono-telemetry truncate">{c.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[6px] border border-[#212d40] bg-[#131a26] p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] mb-3 font-body-telemetry">Field Mapping Schema</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
          {mappedFields.map((m) => (
            <div key={m.to} className="flex items-center gap-2 text-[13px] font-mono-telemetry">
              <span className="text-[#64748b] truncate">{m.from}</span>
              <ArrowRight className="w-3 h-3 text-[#00f2fe] shrink-0" />
              <span className="text-[#f8fafc] truncate">{m.to}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}