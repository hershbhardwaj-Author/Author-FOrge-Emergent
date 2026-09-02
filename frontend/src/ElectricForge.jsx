import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  X, Triangle, Users, FileText, BookOpen, Megaphone, Globe,
  ArrowRight, ArrowUpRight, Check, Feather, Flame
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/* ──────────────────────────────────────────────────────────────────────────────
   Scroll Spy Hook
   ─────────────────────────────────────────────────────────────────────────── */

const useScrollSpy = (ids, offset = 120) => {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY + offset;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scroll) {
          setActive(ids[i]);
          return;
        }
      }
      setActive(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);
  return active;
};

/* ──────────────────────────────────────────────────────────────────────────────
   Navigation Bar
   ─────────────────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Journey", href: "#journey" },
  { label: "Covenant", href: "#covenant" },
  { label: "Deliverables", href: "#deliverables" },
  { label: "Imprint", href: "#imprint" },
  { label: "Mentor", href: "#mentor" },
  { label: "Catalogue", href: "/shreem-books", external: true },
  { label: "Investment", href: "/investment", external: true },
];

const NavBar = ({ onApply }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useScrollSpy(["journey", "covenant", "deliverables", "imprint", "mentor", "apply"]);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--ia-ivory-warm)] border-b hairline">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 h-16 flex items-center justify-between">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-display text-xl text-[var(--ia-ink)] hover:text-[var(--ia-forest)] transition-colors">
            The Author's Forge
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              link.external ? (
                <Link key={link.href} to={link.href} className="eyebrow text-[11px] tracking-[0.2em] uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-forest)] transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className={`eyebrow text-[11px] tracking-[0.2em] uppercase transition-colors ${active === link.href.slice(1) ? "text-[var(--ia-forest)]" : "text-[var(--ia-ink-mute)] hover:text-[var(--ia-forest)]"}`}>
                  {link.label}
                </a>
              )
            ))}
            <button onClick={onApply} className="h-9 px-6 bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] text-[11px] tracking-[0.2em] uppercase hover:bg-[var(--ia-forest)] transition-colors">
              Apply
            </button>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center border hairline">
            <span className="sr-only">Menu</span>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth
