import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import RequestAccessForm from "@/components/landing/RequestAccessForm";

export default function HeroApplyForm() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: free-floating form card beside hero text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="hidden lg:block w-full max-w-md ml-auto"
      >
        <div className="bg-card rounded-2xl shadow-2xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-accent" />
            <h3 className="font-heading text-lg font-bold text-card-foreground">Ansök om åtkomst</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Fyll i uppgifter om din klinik så återkommer vi med inloggningsuppgifter.
          </p>
          <RequestAccessForm compact />
        </div>
      </motion.div>

      {/* Mobile: sticky floating button + bottom sheet */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full h-12 bg-accent text-white font-heading font-semibold text-sm uppercase tracking-wide rounded-full shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Ansök om åtkomst
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-3 text-left">
            <SheetTitle className="font-heading text-xl">Ansök om åtkomst</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Fyll i uppgifter om din klinik. Obligatoriska fält är markerade med *.
            </p>
          </SheetHeader>
          <div className="px-6 pb-8">
            <RequestAccessForm compact />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}