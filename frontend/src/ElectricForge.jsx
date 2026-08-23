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
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--ia-ink)]">
              <path d="M1 1h18M1 7h18M1 13h18" />
            </svg>
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-6 py-6 flex flex-col gap-4 border-t hairline">
            {NAV_LINKS.map((link) => (
              link.external ? (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="font-display text-lg text-[var(--ia-ink)] hover:text-[var(--ia-forest)] transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className={`font-display text-lg transition-colors ${active === link.href.slice(1) ? "text-[var(--ia-forest)]" : "text-[var(--ia-ink)] hover:text-[var(--ia-forest)]"}`}>
                  {link.label}
                </a>
              )
            ))}
            <button onClick={() => { setMobileOpen(false); onApply(); }} className="mt-4 h-12 w-full bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] text-[11px] tracking-[0.2em] uppercase hover:bg-[var(--ia-forest)] transition-colors">
              Apply for the Forge
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

/* ──────────────────────────────────────────────────────────────────────────────
   Editorial Ornament Components
   ─────────────────────────────────────────────────────────────────────────── */

const Eyebrow = ({ children, className = "", testId }) => (
  <span data-testid={testId} className={`eyebrow ${className}`}>{children}</span>
);

const Ornament = ({ className = "" }) => (
  <span aria-hidden className={`inline-flex items-center justify-center ${className}`}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
    </svg>
  </span>
);

const RuleOrnament = ({ glyph = "✦" }) => (
  <div className="relative h-px w-full bg-[var(--ia-rule)]">
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--ia-ivory)] px-4 text-[var(--ia-bronze)] text-[11px] tracking-[0.4em]">
      {glyph}
    </span>
  </div>
);

const FolioNumber = ({ n }) => (
  <span className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-ink-mute)] uppercase">
    №&nbsp;{String(n).padStart(2, "0")}
  </span>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Apply Drawer
   ─────────────────────────────────────────────────────────────────────────── */

const ApplyDrawer = ({ open, onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setDone(null);
      setErr(null);
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = {
      name: form["af-name"].value.trim(),
      email: form["af-email"].value.trim(),
      expertise: form["af-expertise"].value,
      concept: form["af-concept"].value.trim(),
      stage: form["af-stage"].value || "",
    };
    setSubmitting(true);
    setErr(null);
    try {
      const res = await axios.post('https://little-morning-4803.hersh-bhardwaj.workers.dev', payload);
      setDone("Application received.");
      form.reset();
    } catch (e2) {
      const detail = e2?.response?.data?.detail;
      setErr(
        Array.isArray(detail) ? detail.map(d => d.msg).join(" · ") :
        (typeof detail === "string" ? detail : "Submission failed. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        data-testid="apply-drawer-overlay"
        className={`fixed inset-0 z-[90] bg-[var(--ia-ink)] transition-opacity duration-500 ${open ? "opacity-50" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Apply for The Author's Forge"
        data-testid="apply-drawer"
        className={`fixed top-0 right-0 h-full z-[100] w-full max-w-[560px] bg-[var(--ia-ivory-warm)] border-l hairline flex flex-col transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between p-8 sm:p-10 border-b hairline shrink-0">
          <div>
            <Eyebrow className="text-[var(--ia-bronze-deep)]">The Author's Forge — Apply</Eyebrow>
            <div className="font-display text-4xl sm:text-5xl leading-[0.95] mt-3">
              Apply for<br /><em className="font-display-italic">the Forge</em>
            </div>
            <div className="mt-3 text-sm text-[var(--ia-ink-mute)] italic">Next cohort — 4 spots remaining</div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            data-testid="apply-drawer-close"
            className="w-11 h-11 border hairline flex items-center justify-center text-[var(--ia-ink)] hover:bg-[var(--ia-ink)] hover:text-[var(--ia-ivory-warm)]"
          >
            <X size={16} strokeWidth={1.2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <form noValidate onSubmit={submit} className="p-8 sm:p-10 flex flex-col gap-8">
            <Field label="Full Name" htmlFor="af-name">
              <input id="af-name" data-testid="apply-input-name" required autoComplete="name" placeholder="Jane Smith" type="text" className="atelier-input" />
            </Field>
            <Field label="Email Address" htmlFor="af-email">
              <input id="af-email" data-testid="apply-input-email" required autoComplete="email" placeholder="jane@example.com" type="email" className="atelier-input" />
            </Field>
            <Field label="Area of Expertise" htmlFor="af-expertise">
              <select id="af-expertise" data-testid="apply-select-expertise" required defaultValue="" className="atelier-input">
                <option value="" disabled>Select your field</option>
                <option>Executive Leadership</option>
                <option>Business Strategy</option>
                <option>Sales &amp; Marketing</option>
                <option>Health &amp; Wellness Coaching</option>
                <option>Personal Development</option>
                <option>Finance &amp; Wealth</option>
                <option>Legal or Professional Services</option>
                <option>Technology &amp; Innovation</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Your Book Concept" htmlFor="af-concept">
              <textarea id="af-concept" data-testid="apply-textarea-concept" required rows={4} placeholder="What's your book about? Who's it for? What problem does it solve?" className="atelier-input" />
            </Field>
            <Field label="Where Are You Right Now?" htmlFor="af-stage" optional>
              <select id="af-stage" data-testid="apply-select-stage" defaultValue="" className="atelier-input">
                <option value="">Select your current stage (optional)</option>
                <option>I have a complete outline</option>
                <option>I have rough notes and ideas</option>
                <option>I know my topic but nothing written</option>
                <option>I have a vague concept</option>
                <option>I don't know where to start yet</option>
              </select>
            </Field>

            <button type="submit" data-testid="apply-submit" disabled={submitting} className="btn-primary mt-2 w-full disabled:opacity-60 disabled:cursor-not-allowed">
              <span>{submitting ? "Submitting…" : "Submit Application"}</span>
              <Feather size={14} strokeWidth={1.4} className="relative -mt-px" />
            </button>
            {done && (
              <p data-testid="apply-success" className="text-sm italic text-[var(--ia-forest)] text-center mt-2">
                ✦ {done}
              </p>
            )}
            {err && (
              <p data-testid="apply-error" className="text-sm italic text-red-700 text-center mt-2">
                {err}
              </p>
            )}
            <p className="text-xs italic text-[var(--ia-ink-mute)] text-center mt-2">
              Applications reviewed within 48 hours. No spam — ever.
            </p>
          </form>
        </div>
      </aside>
    </>
  );
};

const Field = ({ label, htmlFor, optional, children }) => (
  <div>
    <label htmlFor={htmlFor} className="flex items-baseline justify-between mb-2">
      <span className="eyebrow">{label}</span>
      {optional && <span className="text-[10px] italic text-[var(--ia-ink-mute)]">Optional</span>}
    </label>
    {children}
  </div>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Top Marquee
   ─────────────────────────────────────────────────────────────────────────── */

const Marquee = () => {
  const items = [
    "20 Weeks", "10–12 Authors Max", "Weekly Live Masterclass",
    "1:1 Monthly Strategy Call", "The Author's Portal",
    "Guaranteed Publishing", "Marketing Blueprint", "World-Class Execution"
  ];
  const sequence = [...items, ...items];
  return (
    <div data-testid="marquee" className="w-full bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] py-3 overflow-hidden">
      <div className="marquee-track items-center gap-12">
        {sequence.map((label, i) => (
          <span key={i} className="flex items-center gap-8 shrink-0">
            <span className="font-display italic text-[22px] tracking-[0.04em] whitespace-nowrap">{label}</span>
            <span aria-hidden className="text-[var(--ia-bronze)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────────
   Cohort Books - FIXED VERSION
   ─────────────────────────────────────────────────────────────────────────── */

const CountdownSection = ({ onApply }) => {
  return (
    <section id="hero" data-testid="section-countdown" className="bg-[var(--ia-ivory-warm)] border-b hairline">
      <div className="bg-[var(--ia-forest)] text-[var(--ia-ivory-warm)] py-3 px-6 flex items-center justify-center gap-4 text-center">
        <Triangle size={11} strokeWidth={1.2} className="text-[var(--ia-bronze)]" />
        <span className="eyebrow text-[var(--ia-ivory-warm)]">Present Cohort — Books in Forge</span>
        <Triangle size={11} strokeWidth={1.2} className="text-[var(--ia-bronze)]" />
      </div>

      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-10 border-b hairline">
          <div>
            <Eyebrow>The Author's Forge · Expertise To Books</Eyebrow>
            <h1 className="mt-4 font-display text-[44px] sm:text-[62px] leading-[0.95]">
              From idea to <em className="font-display-italic text-[var(--ia-forest)]">published author</em><br />in five months.
            </h1>
            <div className="mt-6 max-w-xl">
              <div className="h-px w-16 bg-[var(--ia-rule)] mb-4" />
              <p className="text-lg sm:text-xl text-[var(--ia-ink-mute)] italic leading-relaxed">
                You have spent decades building your expertise.</p>
<p Now turn what you have learned into the book only you can write.</p>
<p A personally guided 20-week experience to extract, structure and shape your experience into a complete manuscript</p> <p — without handing your story to a ghostwriter.
              </p>
            </div>
          </div>
          <button onClick={onApply} data-testid="masthead-apply" className="btn-ghost shrink-0">
            <span>Apply for the Forge</span><ArrowRight size={14} strokeWidth={1.3} />
          </button>
        </div>

        <div className="mt-16">
          <div className="flex flex-col items-center text-center">
            <FolioNumber n={1} />
            <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.92]">
              Present <em className="font-display-italic text-[var(--ia-forest)]">Cohort Books</em>
            </h2>
            <p className="mt-4 text-lg text-[var(--ia-ink-mute)] italic"> Ideas in Final Stages. (Covers are WIP) .</p>
            <div className="mt-10 w-24"><RuleOrnament glyph="✦" /></div>
          </div>

          <div className="mt-12 border hairline p-2 sm:p-3 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <picture>
              <source srcSet="/cohort-books-poster-1200.webp" type="image/webp" />
              <img
                src="/cohort-books-poster-1200.webp"
                alt="Books in the Forge - The Everest Inside, The Impossible Goals, Nine Steps to Five"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────────────────────────
   5-Month Journey
   ─────────────────────────────────────────────────────────────────────────── */

const PHASES = [
  { n: "01", title: "The Architecture", tag: "Month 1", body: "Blueprint the foundation. We tear down your ideas and rebuild them into an unshakable structure.", accent: "bronze" },
  { n: "02", title: "The Writing Forge", tag: "Months 2 & 3", body: "This is where the fire gets hot. Intensive, relentless writing with rigorous editorial interrogation. You author every chapter. We challenge every assumption.", accent: "forest", icon: Flame },
  { n: "03", title: "Publishing Mechanics", tag: "Month 4", body: "We handle the technical execution. Typesetting, cover design, and publication under James Hemingway of Shreem Books. You retain full rights and royalties. See the Shreem Books catalogue.", accent: "ink", link: "/shreem-books" },
  { n: "04", title: "The Publicity Engine", tag: "Month 5", body: "Launch preparation. We engineer your launch so your market notices.", accent: "forest-dark" },
  { n: "05", title: "Beyond the Book", tag: "Ongoing", body: "Your book is a weapon. We teach you how to wield it to dominate your industry long-term.", accent: "bronze-soft" },
];

const JourneySection = () => (
  <section id="journey" data-testid="section-journey" className="bg-[var(--ia-ivory)] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-b hairline">
    <div className="max-w-[1480px] mx-auto">
      <div className="flex flex-col items-center text-center mb-20">
        <FolioNumber n={2} />
        <h2 className="mt-6 font-display text-[56px] sm:text-[88px] leading-[0.92]">
          The 5-Month <em className="font-display-italic text-[var(--ia-forest)]">Journey</em>
        </h2>
        <div className="mt-10 w-24"><RuleOrnament glyph="✦" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--ia-rule)] border hairline">
        {PHASES.map((p, idx) => {
          const dark = p.accent === "ink" || p.accent === "forest-dark";
          const bg =
            p.accent === "ink" ? "bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)]" :
            p.accent === "forest-dark" ? "bg-[var(--ia-forest-deep)] text-[var(--ia-ivory-warm)]" :
            p.accent === "forest" ? "bg-[var(--ia-ivory-warm)] text-[var(--ia-ink)]" :
            p.accent === "bronze" ? "bg-[var(--ia-ivory-warm)] text-[var(--ia-ink)]" :
            "bg-[var(--ia-ivory-warm)] text-[var(--ia-ink)]";
          const accentColor =
            p.accent === "forest" ? "text-[var(--ia-forest)]" :
            p.accent === "bronze" ? "text-[var(--ia-bronze-deep)]" :
            p.accent === "bronze-soft" ? "text-[var(--ia-bronze-deep)]" :
            p.accent === "ink" ? "text-[var(--ia-bronze)]" :
            p.accent === "forest-dark" ? "text-[var(--ia-bronze)]" : "";
          const span = idx === 1 ? "md:col-span-2 lg:col-span-1" : idx === 4 ? "md:col-span-2" : "";
          const Icon = p.icon;
          return (
            <article
              data-testid={`card-phase-${idx + 1}`}
              key={p.n}
              className={`group relative ${bg} p-10 sm:p-12 flex flex-col ${span}`}
            >
              <div className="flex items-start justify-between">
                <span className={`font-display tabular text-[64px] leading-none ${accentColor}`}>{p.n}</span>
                {Icon && <Icon size={28} strokeWidth={1.1} className={accentColor} />}
              </div>
              <div className={`mt-8 h-px ${dark ? "bg-white/15" : "bg-[var(--ia-rule)]"}`} />
              <h3 className="mt-8 font-display text-3xl leading-tight">{p.title}</h3>
              <div className={`mt-3 eyebrow ${dark ? "text-[var(--ia-bronze)]" : ""}`}>{p.tag}</div>
              <p className={`mt-6 text-lg leading-relaxed flex-1 ${dark ? "text-white/80" : "text-[var(--ia-ink-soft)]"}`}>
                {p.body}
              </p>
              {p.link && (
                <Link 
                  to={p.link}
                  className={`mt-4 inline-flex items-center gap-2 text-sm ${dark ? "text-[var(--ia-bronze)] hover:text-white" : "text-[var(--ia-forest)] hover:text-[var(--ia-ink)]"} transition-colors duration-300`}
                >
                  <span className="text-[10px] tracking-[0.2em] uppercase">View Catalogue</span>
                  <ArrowUpRight size={12} strokeWidth={1.3} />
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   The Author's Covenant — Ghostwriter vs. Forge distinction
   ─────────────────────────────────────────────────────────────────────────── */

const AuthorCovenantSection = () => (
  <section id="covenant" data-testid="section-covenant" className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <FolioNumber n={3} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[72px] leading-[0.95]">
          The Author's <em className="font-display-italic">Covenant.</em>
        </h2>
        <div className="mt-10 w-24"><RuleOrnament glyph="✦" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
        <div className="lg:border-r hairline p-10 lg:p-16 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-7 h-7 border hairline rounded-full flex items-center justify-center text-[var(--ia-ink-mute)]">
              <X size={12} strokeWidth={1.3} />
            </span>
            <Eyebrow>The Ghostwriter's Path</Eyebrow>
          </div>
          <h3 className="font-display text-[28px] sm:text-[40px] leading-tight border-l hairline pl-6 text-[var(--ia-ink-soft)]">
            You rent authority you cannot defend.
          </h3>
          <ul className="mt-10 space-y-5">
            {[
              "Someone else captures your voice",
              "You own the byline, not the expertise",
              "The manuscript is foreign to you on stage",
              "You hope no one asks about Chapter Seven",
            ].map((b, i) => (
              <li key={i} className="flex items-baseline gap-4 text-[var(--ia-ink-mute)]">
                <span className="font-display tabular text-xs tracking-[0.3em] mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-10 lg:p-16 flex flex-col bg-[var(--ia-ivory-deep)]">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-7 h-7 border border-[var(--ia-forest)] rounded-full flex items-center justify-center text-[var(--ia-forest)]">
              <Check size={12} strokeWidth={1.5} />
            </span>
            <Eyebrow className="text-[var(--ia-forest)]">The Forge</Eyebrow>
          </div>
          <h3 className="font-display text-[28px] sm:text-[40px] leading-tight border-l border-[var(--ia-forest)] pl-6 text-[var(--ia-ink)]">
            You forge authority you own absolutely.
          </h3>
          <ul className="mt-10 space-y-5">
            {[
              "Every word originates from your expertise",
              "Our editors interrogate, they do not imitate",
              "You can defend every argument on a podcast",
              "The manuscript is yours because the labor is yours",
            ].map((b, i) => (
              <li key={i} className="flex items-baseline gap-4 text-[var(--ia-ink-soft)]">
                <span className="font-display tabular text-xs tracking-[0.3em] mt-1 shrink-0 text-[var(--ia-forest)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t hairline pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[var(--ia-ink-mute)]">
          <span className="text-[10px] tracking-[0.4em] uppercase">Chapter 01</span>
          <span className="leader-dots" />
        </div>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Portfolio / Here's What Gets Built
   ─────────────────────────────────────────────────────────────────────────── */

const DELIVERABLES = [
  { tag: "Deliverable 01", title: "Finished Manuscript", meta: "70,000–90,000 Words", icon: FileText,
    detail: "A complete, edited, structurally sound manuscript — line-edited, sequenced, and ready for typesetting." },
  { tag: "Deliverable 02", title: "Published Book", meta: "Print + Digital", icon: BookOpen,
    detail: "Typeset, cover-designed, and published under Shreem Books across hardcover, paperback, ebook and audiobook distribution. View the complete Shreem Books catalogue.", link: "/shreem-books" },
  { tag: "Deliverable 03", title: "Marketing Blueprint", meta: "Launch Strategy", icon: Megaphone,
    detail: "A full launch plan: positioning, PR pathways, social architecture, podcast tour and bulk-order logistics." },
  { tag: "Deliverable 04", title: "Lasting Authority", meta: "Market Position", icon: Globe,
    detail: "A named position in your category — the source of citation, invitation, and inbound that compounds for years." },
];

const PortfolioSection = () => (
  <section id="deliverables" data-testid="section-portfolio" className="bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] border-b border-[var(--ia-forest-deep)]">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-end pb-12 border-b border-white/10">
        <div>
          <FolioNumber n={5} />
          <h2 className="mt-6 font-display text-[56px] sm:text-[88px] leading-[0.92]">
            Here's what<br /><em className="font-display-italic text-[var(--ia-bronze)]">gets built.</em>
          </h2>
        </div>
        <p className="text-lg sm:text-xl text-white/70 italic max-w-xl leading-relaxed">
          We don't describe deliverables. We show you exactly what every author walks away with after 5 months.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-px gap-px bg-white/10 border border-white/10">
        {DELIVERABLES.map((d) => {
          const Icon = d.icon;
          return (
            <div
              key={d.tag}
              data-testid={`deliverable-${d.tag}`}
              className="group bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] p-8 sm:p-10 flex flex-col hover:bg-[var(--ia-forest-deep)] transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/40">
                  {d.tag}
                </span>
                <ArrowUpRight size={16} strokeWidth={1.1} className="text-[var(--ia-bronze)]" />
              </div>
              <Icon size={26} strokeWidth={1.1} className="text-[var(--ia-bronze)] mt-4" />
              <div className="font-display text-2xl sm:text-[28px] leading-tight mt-4">{d.title}</div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-white/40 mt-3">
                {d.meta}
              </div>
              <p className="text-white/80 leading-relaxed text-base mt-6 flex-1">
                {d.detail}
              </p>
              {d.link && (
                <Link
                  to={d.link}
                  className="mt-4 inline-flex items-center gap-2 text-[var(--ia-bronze)] text-sm hover:text-white transition-colors duration-300"
                >
                  <span className="text-[10px] tracking-[0.2em] uppercase">View Catalogue</span>
                  <ArrowUpRight size={12} strokeWidth={1.3} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   The Imprint — Publisher transparency
   ─────────────────────────────────────────────────────────────────────────── */

const ImprintSection = () => (
  <section id="imprint" data-testid="section-imprint" className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="max-w-[65ch] mx-auto">
        <FolioNumber n={6} />
        <h2 className="mt-6 font-display text-[48px] sm:text-[72px] leading-[0.95]">
          The <em className="font-display-italic text-[var(--ia-forest)]">Imprint.</em>
        </h2>
        <div className="mt-10 w-24"><RuleOrnament glyph="✦" /></div>

        <div className="mt-16 space-y-16">
          <div>
            <h3 className="font-display text-2xl leading-tight mb-4">Publication under James Hemingway of Shreem Books.</h3>
            <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">
              Your book is published under our dedicated nonfiction imprint. Not a vanity press. Not a third-party logo we rent. An imprint built solely for Forge authors.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[var(--ia-ink-mute)]">
              <span className="text-[10px] tracking-[0.4em] uppercase">Chapter 01</span>
              <span className="leader-dots" />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl leading-tight mb-4">Ownership</h3>
            <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">
              You retain 100% of rights and royalties. The ISBN is registered in your name. You own the asset.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[var(--ia-ink-mute)]">
              <span className="text-[10px] tracking-[0.4em] uppercase">Chapter 02</span>
              <span className="leader-dots" />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl leading-tight mb-4">Distribution</h3>
            <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">
              Hardcover, paperback, and ebook distributed via IngramSpark and Amazon KDP. Available to any bookstore with an ordering system.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[var(--ia-ink-mute)]">
              <span className="text-[10px] tracking-[0.4em] uppercase">Chapter 03</span>
              <span className="leader-dots" />
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl leading-tight mb-4">The Legal Framework</h3>
            <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">
              We handle the mechanicals. You hold the copyright. The contract is simple enough to read in one sitting.
            </p>
          </div>

          <div className="pt-8 border-t hairline">
            <h3 className="font-display text-2xl leading-tight mb-4">The Shreem Books Catalogue</h3>
            <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)] mb-8">
              Fourteen titles published under the imprint. Books that earned their place on a shelf.
            </p>
            <Link 
              to="/shreem-books" 
              className="inline-flex items-center gap-3 h-[52px] px-10 bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] text-[11px] tracking-[0.28em] uppercase hover:bg-[var(--ia-forest)] transition-colors duration-300"
            >
              <span>View the Catalogue</span>
              <ArrowUpRight size={13} strokeWidth={1.3} />
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t hairline flex items-center gap-4 text-[var(--ia-ink-mute)]">
          <span className="font-display tabular text-[11px] tracking-[0.4em] uppercase">Folio</span>
          <span className="leader-dots" />
          <span className="font-display tabular text-[11px] tracking-[0.4em] uppercase">Imprint · 4 pp</span>
        </div>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Mentor Poster
   ─────────────────────────────────────────────────────────────────────────── */

const MentorPosterSection = () => (
  <section id="mentor" data-testid="section-mentor-poster" className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-16 sm:py-20">
      <Link to="/mentor" className="group block relative overflow-hidden border hairline">
        <div className="aspect-[21/9] bg-[var(--ia-ink)] flex items-center justify-center relative overflow-hidden">
          <img
            src="/mentor-poster.jpg"
            alt="Meet Hersh Bhardwaj — Program Mentor & Editor"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="font-display-italic text-3xl sm:text-5xl text-[var(--ia-bronze)]">Meet the Editor</span>';
            }}
          />
          <div className="absolute inset-0 bg-[var(--ia-ink)]/20 group-hover:bg-[var(--ia-ink)]/10 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 flex items-end justify-between">
            <div>
              <Eyebrow className="text-[var(--ia-ivory-warm)] mb-2">Program Mentor & Editor</Eyebrow>
              <h3 className="font-display text-2xl sm:text-4xl text-[var(--ia-ivory-warm)] leading-tight">
                Meet the editor <em className="font-display-italic text-[var(--ia-bronze)]">behind the Forge</em>
              </h3>
            </div>
            <span className="hidden sm:flex items-center gap-2 text-[var(--ia-ivory-warm)] text-sm tracking-[0.2em] uppercase border border-[var(--ia-ivory-warm)]/30 px-5 py-3 group-hover:bg-[var(--ia-ivory-warm)] group-hover:text-[var(--ia-ink)] transition-all duration-300">
              Read the story <ArrowRight size={14} strokeWidth={1.3} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Final CTA
   ─────────────────────────────────────────────────────────────────────────── */

const FinalCTA = ({ onApply }) => (
  <section id="apply" data-testid="section-cta" className="bg-[var(--ia-ivory)] py-32 sm:py-40 px-6 sm:px-12">
    <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
      <FolioNumber n={10} />
      <h2 data-testid="text-cta-headline" className="mt-8 font-display text-[44px] sm:text-[88px] leading-[0.95]">
        You don't just write a book.<br />
        <em className="font-display-italic text-[var(--ia-forest)]">You become the kind of author</em><br />
        the world pays attention to.
      </h2>

      <div className="mt-12 w-24"><RuleOrnament glyph="✦" /></div>

      <p className="mt-12 text-lg sm:text-xl text-[var(--ia-ink-soft)] max-w-xl italic leading-relaxed">
        Join a curated group of high-achieving experts. Spots are strictly limited to 10–12 authors per cohort.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button data-testid="button-apply-cta" onClick={onApply} className="btn-primary px-14 py-5">
          <span>Apply for the Next Cohort</span>
          <Feather size={14} strokeWidth={1.3} />
        </button>
        <Link
          to="/investment"
          className="flex items-center gap-3 h-[52px] px-10 bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] text-[11px] tracking-[0.28em] uppercase hover:bg-[var(--ia-forest)] transition-colors duration-300"
        >
          <span>View Investment</span>
          <ArrowRight size={13} strokeWidth={1.3} />
        </Link>
      </div>

      <div className="mt-6 eyebrow">Applications reviewed within 48 hours</div>
    </div>

    <div className="max-w-[1480px] mx-auto mt-32 pt-10 border-t hairline grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-[var(--ia-ink-mute)]">
      <div>
        <div className="font-display text-2xl text-[var(--ia-ink)]">The Author's Forge</div>
        <div className="mt-2 italic">Electric — a publishing incubator for serious experts.</div>
      </div>
      <div>
        <Eyebrow>Imprint</Eyebrow>
        <div className="mt-3 italic">Five-month residency · Limited to 10–12 authors per cohort · By application only.</div>
      </div>
      <div className="sm:text-right">
        <Eyebrow>Established</Eyebrow>
        <div className="mt-3 font-display tabular text-2xl text-[var(--ia-ink)]">MMXXIV</div>
        <div className="mt-2 text-sm italic text-[var(--ia-ink-mute)]">
          By application only. Limited to 10–12 authors per cohort.
        </div>
        <Link 
          to="/shreem-books" 
          className="mt-3 inline-flex items-center gap-2 text-[var(--ia-forest)] text-sm hover:text-[var(--ia-ink)] transition-colors duration-300"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">Shreem Books Catalogue</span>
          <ArrowUpRight size={12} strokeWidth={1.3} />
        </Link>
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Lead Magnets
   ─────────────────────────────────────────────────────────────────────────── */

const useMagnetForm = (source) => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await axios.post(`${API}/leads`, { source, email: trimmed });
      const msg = res.data?.message || "Thank you.";
      const dl = res.data?.download_url;
      setDone(msg);
      setEmail("");
      if (dl) {
        const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${dl}`;
        window.open(fullUrl, "_blank", "noopener,noreferrer");
      }
      setTimeout(() => setDone(null), 8000);
    } catch (e2) {
      const detail = e2?.response?.data?.detail;
      setErr(
        Array.isArray(detail) ? detail.map(d => d.msg).join(" · ") :
        (typeof detail === "string" ? detail : "Submission failed. Please try again.")
      );
    } finally {
      setBusy(false);
    }
  };
  return { email, setEmail, done, err, busy, submit };
};

const CurriculumBriefStrip = () => {
  const { email, setEmail, done, err, busy, submit } = useMagnetForm("curriculum-brief");
  return (
    <section data-testid="leadmagnet-curriculum" className="bg-[var(--ia-ivory)] border-y hairline">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.4fr_1fr] items-center gap-10 lg:gap-16">
          <div className="flex items-center gap-6">
            <span className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-bronze-deep)] uppercase shrink-0">Tipped-in № i</span>
            <span className="leader-dots hidden lg:block" />
          </div>
          <div>
            <h3 className="font-display text-[28px] sm:text-[36px] leading-[1.05]">
              The <em className="font-display-italic">Curriculum Brief</em>
              <span className="block text-[15px] sm:text-base italic text-[var(--ia-ink-mute)] mt-2 not-italic">
                A six-page editorial breakdown of the five-month residency. By post or PDF.
              </span>
            </h3>
          </div>
          <form onSubmit={submit} noValidate className="flex items-end gap-4 w-full">
            <div className="flex-1 min-w-0">
              <label htmlFor="lm-curriculum-email" className="eyebrow block mb-2">Your Email</label>
              <input
                id="lm-curriculum-email"
                data-testid="leadmagnet-curriculum-email"
                type="email"
                required
                placeholder="name@firm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="atelier-input"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              data-testid="leadmagnet-curriculum-submit"
              aria-label="Request brief"
              className="shrink-0 h-11 w-11 border border-[var(--ia-ink)] flex items-center justify-center text-[var(--ia-ink)] hover:bg-[var(--ia-ink)] hover:text-[var(--ia-ivory-warm)] disabled:opacity-50"
            >
              <ArrowRight size={14} strokeWidth={1.3} />
            </button>
          </form>
        </div>
        {done && (
          <p data-testid="leadmagnet-curriculum-success" className="mt-6 text-sm italic text-[var(--ia-forest)]">
            ✦ {done} Your brief is opening in a new tab.
          </p>
        )}
        {err && (
          <p data-testid="leadmagnet-curriculum-error" className="mt-6 text-sm italic text-red-700">
            {err}
          </p>
        )}
      </div>
    </section>
  );
};

const SpecimenCard = () => {
  const { email, setEmail, done, err, busy, submit } = useMagnetForm("specimen-page");
  return (
    <section data-testid="leadmagnet-specimen" className="bg-[var(--ia-ivory)] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-b hairline">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 lg:col-start-2">
          <Eyebrow className="text-[var(--ia-bronze-deep)]">Tipped-in № ii</Eyebrow>
          <h3 className="mt-5 font-display text-[40px] sm:text-[52px] leading-[0.95]">
            A <em className="font-display-italic text-[var(--ia-forest)]">specimen page</em>, in your inbox.
          </h3>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pl-12 lg:border-l hairline">
          <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)] first-letter:font-display first-letter:text-[64px] first-letter:leading-[0.85] first-letter:float-left first-letter:pr-3 first-letter:pt-1 first-letter:text-[var(--ia-bronze-deep)]">
            A finished chapter from a Forge author — typeset, edited, ready for print. Read the standard before you commit to the residency. Sent once, never followed up unless you ask.
          </p>

          <form onSubmit={submit} noValidate className="mt-10 flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <label htmlFor="lm-specimen-email" className="eyebrow block mb-2">Send the specimen to</label>
              <input
                id="lm-specimen-email"
                data-testid="leadmagnet-specimen-email"
                type="email"
                required
                placeholder="reader@yourname.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="atelier-input"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              data-testid="leadmagnet-specimen-submit"
              className="btn-ghost shrink-0 disabled:opacity-50"
            >
              <span>{busy ? "Sending…" : "Receive"}</span>
              <ArrowRight size={14} strokeWidth={1.3} />
            </button>
          </form>

          {done && (
            <p data-testid="leadmagnet-specimen-success" className="mt-5 text-sm italic text-[var(--ia-forest)]">
              ✦ {done} Opening the specimen now.
            </p>
          )}
          {err && (
            <p data-testid="leadmagnet-specimen-error" className="mt-5 text-sm italic text-red-700">
              {err}
            </p>
          )}

          <div className="mt-10 flex items-center gap-4 text-[var(--ia-ink-mute)]">
            <span className="font-display tabular text-[11px] tracking-[0.4em] uppercase">Folio</span>
            <span className="leader-dots" />
            <span className="font-display tabular text-[11px] tracking-[0.4em] uppercase">Sample · 12 pp</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────────────────────────
   Root
   ─────────────────────────────────────────────────────────────────────────── */

export default function ElectricForge() {
  const [open, setOpen] = useState(false);
  const onApply = () => setOpen(true);

  const observerRef = useRef(null);
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-in");
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current && observerRef.current.disconnect();
  }, []);

  return (
    <div data-testid="page-root" className="min-h-screen bg-[var(--ia-ivory)] text-[var(--ia-ink)] selection:bg-[var(--ia-forest)] selection:text-[var(--ia-ivory-warm)] overflow-x-hidden">
      <ApplyDrawer open={open} onClose={() => setOpen(false)} />
      <NavBar onApply={onApply} />
      <div className="pt-16">
        <Marquee />
        <div className="reveal-in"><CountdownSection onApply={onApply} /></div>
        <div className="reveal-in"><JourneySection /></div>
        <div className="reveal-in"><AuthorCovenantSection /></div>
        <div className="reveal-in"><PortfolioSection /></div>
        <div className="reveal-in"><ImprintSection /></div>
        <div className="reveal-in"><MentorPosterSection /></div>
        <div className="reveal-in"><FinalCTA onApply={onApply} /></div>
        <div className="reveal-in"><CurriculumBriefStrip /></div>
        <div className="reveal-in"><SpecimenCard /></div>
      </div>
    </div>
  );
}
