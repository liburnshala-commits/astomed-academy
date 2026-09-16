import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function AdminRoute() {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return <DefaultFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <ShieldAlert className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Åtkomst nekad</h1>
        <p className="text-muted-foreground max-w-sm">
          Du har inte behörighet att visa den här sidan. Kontakta administratören om du tror att detta är ett fel.
        </p>
      </div>
    );
  }

  return <Outlet />;
}