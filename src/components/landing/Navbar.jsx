import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/40" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo matching Astomed style */}
        <Link to="/" className="flex items-center gap-1">
          <span className="font-heading text-xl font-semibold tracking-tight text-foreground">Astomed</span>
          <sup className="text-[10px] font-body text-muted-foreground mt-1">™</sup>
          <span className="ml-2 text-xs font-body font-medium uppercase tracking-[0.18em] text-accent border-l border-border/60 pl-2">Academy</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#kurser" className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Kurser</a>
          <a href="#om-oss" className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Om oss</a>
          <a href="#kontakt" className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Kontakt</a>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="font-body font-medium text-xs tracking-wide">Admin</Button>
          </Link>
        </div>

        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-border px-6 py-4 space-y-3">
          <a href="#kurser" onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Kurser</a>
          <a href="#om-oss" onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Om oss</a>
          <a href="#kontakt" onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Kontakt</a>
          <Link to="/admin" onClick={() => setOpen(false)}>
            <Button variant="outline" size="sm" className="w-full mt-2 font-body">Admin</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}