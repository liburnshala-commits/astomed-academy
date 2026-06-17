import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Award, ShoppingCart, Download, TrendingUp } from "lucide-react";

export default function SalesTab({ modules }) {
  const { data: purchases = [], isLoading: loadingPurchases } = useQuery({
    queryKey: ["all-purchases"],
    queryFn: () => base44.entities.Purchase.list("-created_date"),
  });

  const { data: quizResults = [], isLoading: loadingResults } = useQuery({
    queryKey: ["all-quiz-results"],
    queryFn: () => base44.entities.QuizResult.list("-completed_at"),
  });

  const moduleMap = Object.fromEntries((modules || []).map((m) => [m.id, m]));

  // Deduplicate purchases: one row per unique buyer+module (bundle creates many)
  const uniquePurchases = purchases.filter(
    (p, idx, arr) =>
      arr.findIndex((x) => x.buyer_email === p.buyer_email && x.module_id === p.module_id) === idx
  );

  const totalRevenue = purchases
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const passedResults = quizResults.filter((r) => r.passed);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: ShoppingCart, label: "Unika köp", value: uniquePurchases.length, color: "text-accent" },
          { icon: TrendingUp, label: "Total omsättning", value: `${Math.round(totalRevenue).toLocaleString("sv-SE")} kr`, color: "text-emerald-500" },
          { icon: Award, label: "Certifikat utfärdade", value: passedResults.filter((r) => r.certificate_url).length, color: "text-amber-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-heading font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Purchases table */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50">
          <h3 className="font-heading font-semibold">Köp</h3>
        </div>
        {loadingPurchases ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Laddar...</div>
        ) : uniquePurchases.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Inga köp ännu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-left">
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Köpare</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Modul</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Belopp</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Datum</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {uniquePurchases.map((p) => {
                  const mod = moduleMap[p.module_id];
                  return (
                    <tr key={p.id} className="border-t border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium">{p.buyer_name || "–"}</p>
                        <p className="text-xs text-muted-foreground">{p.buyer_email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {mod ? `M${mod.module_number}: ${mod.title}` : p.module_id?.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 font-semibold">{p.amount ? `${p.amount} kr` : "–"}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {p.created_date ? new Date(p.created_date).toLocaleDateString("sv-SE") : "–"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                          p.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                        }`}>
                          {p.status === "completed" ? "Genomförd" : p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quiz results table */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50">
          <h3 className="font-heading font-semibold">Kunskapskontroller</h3>
        </div>
        {loadingResults ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Laddar...</div>
        ) : quizResults.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Inga genomförda quizar ännu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 text-left">
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Deltagare</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Modul</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Resultat</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Datum</th>
                  <th className="px-4 py-3 font-semibold text-xs text-muted-foreground">Certifikat</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.map((r) => {
                  const mod = moduleMap[r.module_id];
                  return (
                    <tr key={r.id} className="border-t border-border/50 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <p className="font-medium">{r.user_name || "–"}</p>
                        <p className="text-xs text-muted-foreground">{r.user_email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {mod ? `M${mod.module_number}: ${mod.title}` : "–"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${r.passed ? "text-emerald-600" : "text-red-500"}`}>
                          {Math.round(r.score)}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {r.passed ? "✓ Godkänt" : "✗ Ej godkänt"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {r.completed_at ? new Date(r.completed_at).toLocaleDateString("sv-SE") : "–"}
                      </td>
                      <td className="px-4 py-3">
                        {r.certificate_url ? (
                          <a href={r.certificate_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                            <Download className="w-3 h-3" /> Ladda ner
                          </a>
                        ) : r.passed ? (
                          <span className="text-xs text-muted-foreground">Genereras…</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">–</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}