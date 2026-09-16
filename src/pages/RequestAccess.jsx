import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import RequestAccessForm from "@/components/landing/RequestAccessForm";

export default function RequestAccess() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Ansök om åtkomst</h1>
            <p className="text-muted-foreground">
              Fyll i formuläret nedan för att få tillgång till Astomed Academy. Vi återkommer med inloggningsuppgifter.
            </p>
          </div>
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
            <RequestAccessForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}