import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground">Astomed</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Academy</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#kurser" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Kurser</a>
          <a href="#om-oss" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Om oss</a>
          <a href="#kontakt" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Kontakt</a>
          <Link to="/admin">
            <Button variant="outline" size="sm">Admin</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
          <a href="#kurser" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground">Kurser</a>
          <a href="#om-oss" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground">Om oss</a>
          <a href="#kontakt" onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground">Kontakt</a>
          <Link to="/admin" onClick={() => setOpen(false)}>
            <Button variant="outline" size="sm" className="w-full mt-2">Admin</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}