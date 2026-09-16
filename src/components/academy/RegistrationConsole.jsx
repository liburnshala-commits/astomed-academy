import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2, ChevronRight } from "lucide-react";

const statusConfig = {
  forwarded: { label: "FORWARDED", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  pending: { label: "PENDING", color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  error: { label: "ERROR", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

function getStatus(reg) {
  if (reg.forwarded) return "forwarded";
  if (reg.forward_error) return "error";
  return "pending";
}

function buildPayload(reg) {
  const notesParts = [];
  if (reg.address) notesParts.push(`Adress: ${reg.address}`);
  if (reg.city) notesParts.push(`Ort: ${reg.city}`);
  if (reg.equipment_type) notesParts.push(`Utrustning: ${reg.equipment_type}`);
  if (reg.message) notesParts.push(reg.message);
  return {
    company_name: reg.clinic || "",
    contact_person: reg.full_name || "",
    email: reg.email || "",
    phone: reg.phone || "",
    org_number: reg.org_number || "",
    notes: notesParts.join("\n"),
  };
}

export default function RegistrationConsole() {
  const [selected, setSelected] = useState(null);

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["academy-registrations"],
    queryFn: () => base44.entities.AcademyRegistration.list("-created_date", 50),
  });

  return (
    <>
      <div className="rounded-[6px] border border-[#212d40] bg-[#131a26] overflow-hidden flex flex-col h-full">
        <div className="px-4 py-3 border-b border-[#212d40] flex items-center justify-between shrink-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] font-body-telemetry">Data Console & Telemetry Log</p>
          <span className="text-[13px] text-[#64748b] font-mono-telemetry">{registrations.length} records</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[#64748b]" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748b] font-body-telemetry">Inga registreringar än</div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#131a26]">
                <tr className="border-b border-[#212d40]">
                  {["Kontaktperson", "Klinik", "E-post", "Status", "Tid"].map((h) => (
                    <th key={h} className="text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] px-4 py-2 font-body-telemetry">{h}</th>
                  ))}
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => {
                  const cfg = statusConfig[getStatus(reg)];
                  return (
                    <tr key={reg.id} onClick={() => setSelected(reg)} className="border-b border-[#212d40] hover:bg-[#0b0f17] cursor-pointer transition-colors">
                      <td className="px-4 py-2.5 text-sm text-[#f8fafc] font-body-telemetry">{reg.full_name || "—"}</td>
                      <td className="px-4 py-2.5 text-sm text-[#f8fafc] font-body-telemetry">{reg.clinic || "—"}</td>
                      <td className="px-4 py-2.5 text-sm text-[#64748b] font-mono-telemetry">{reg.email || "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-body-telemetry" style={{ color: cfg.color, backgroundColor: cfg.bg }}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-2.5 text-[13px] text-[#64748b] font-mono-telemetry whitespace-nowrap">
                        {new Date(reg.created_date).toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-4 py-2.5"><ChevronRight className="w-4 h-4 text-[#64748b]" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="bg-[#131a26] border-[#212d40] text-[#f8fafc] overflow-y-auto w-[420px] sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle className="text-[#f8fafc] font-display-telemetry">Payload Inspector</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] mb-2 font-body-telemetry">Outgoing → createAcademyLead</p>
                <pre className="text-[13px] text-[#f8fafc] bg-[#0b0f17] border border-[#212d40] rounded-[6px] p-4 overflow-x-auto leading-relaxed font-mono-telemetry">
{JSON.stringify(buildPayload(selected), null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748b] mb-1 font-body-telemetry">Status</p>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-body-telemetry" style={{ color: statusConfig[getStatus(selected)].color, backgroundColor: statusConfig[getStatus(selected)].bg }}>
                  {statusConfig[getStatus(selected)].label}
                </span>
                {selected.forward_error && (
                  <p className="text-xs text-[#ef4444] mt-2 font-mono-telemetry break-words">{selected.forward_error}</p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}