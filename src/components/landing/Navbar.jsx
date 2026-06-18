import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Award, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navHref = (anchor) => isHome ? anchor : `/${anchor}`;

  useEffect(() => {
    const onScroll = () => {};
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Scroll to courses section and filter via URL param
    const section = document.getElementById("kurser");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="https://media.base44.com/images/public/6a2bb2f0c7148c2a75c598c0/459de9175_Astomed_Symbol_bl.png"
            alt="Astomed"
            className="h-7 w-auto"
          />
          <img
            src="https://media.base44.com/images/public/6a2bb2f0c7148c2a75c598c0/37dec4d6c_Astomed_Wordmark_bl.png"
            alt="Astomed"
            className="h-5 w-auto"
          />
          <span className="text-[10px] font-body font-medium text-foreground/50 tracking-widest uppercase ml-0.5">Academy</span>
        </Link>

        {/* Search bar (expands inline) */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 items-center gap-2">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sök kurser, ämnen..."
              className="flex-1 h-9 px-4 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Desktop nav */}
        {!searchOpen && (
          <div className="hidden md:flex items-center gap-6">
            <a href={navHref("#kurser")} className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Grundkurs</a>
            <a href={navHref("#premiummoduler")} className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Premiummoduler</a>
            <a href={navHref("#specialistkurser")} className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Specialistkurser</a>
            <a href={navHref("#om-oss")} className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Om oss</a>
            <a href={navHref("#kontakt")} className="text-sm font-body font-medium text-foreground/70 hover:text-foreground transition-colors">Kontakt</a>
          </div>
        )}

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search icon */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-md text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Sök"
          >
            <Search className="w-4 h-4" />
          </button>

          {isAuthenticated ? (
            /* Logged in: user menu dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-body font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="max-w-[120px] truncate">{user?.full_name?.split(" ")[0] || "Mitt konto"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-lg py-1 z-50">
                  <Link
                    to="/mina-certifikat"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground/80 hover:bg-muted transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    Mina certifikat
                  </Link>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-body text-foreground/80 hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logga ut
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in: Login button */
            <Link to="/login">
              <Button size="sm" className="font-body font-medium text-xs tracking-wide gap-1.5">
                <User className="w-4 h-4" />
                Logga in
              </Button>
            </Link>
          )}

          {/* Admin hidden link (accessible via URL only) */}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-6 pb-2 pt-0">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök kurser..."
            className="flex-1 h-9 px-4 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="submit" className="p-2 text-muted-foreground hover:text-foreground">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-border px-6 py-4 space-y-3">
          <a href={navHref("#kurser")} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Grundkurs</a>
          <a href={navHref("#premiummoduler")} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Premiummoduler</a>
          <a href={navHref("#specialistkurser")} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Specialistkurser</a>
          <a href={navHref("#om-oss")} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Om oss</a>
          <a href={navHref("#kontakt")} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70">Kontakt</a>
          <hr className="border-border" />
          {isAuthenticated ? (
            <>
              <Link to="/mina-certifikat" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full font-body gap-1.5 justify-start">
                  <Award className="w-4 h-4" />
                  Mina certifikat
                </Button>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-sm font-body text-foreground/70 py-1">
                <LogOut className="w-4 h-4" />
                Logga ut
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full font-body gap-1.5">
                <User className="w-4 h-4" />
                Logga in
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}