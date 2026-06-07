import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight, ArrowLeft, X, Feather, Check, BookOpen,
  FileText, Megaphone, Globe, Calendar, Users, Star
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/* ── Shared primitives ───────────────────────────────────────────────────── */

const Eyebrow = ({ children, className = "" }) => (
  <span className={`eyebrow ${className}`}>{children}</span>
);

const FolioNumber = ({ label }) => (
  <span className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-ink-mute)] uppercase">
    {label}
  </span>
);

const RuleOrnament = ({ glyph = "✦", bg = "var(--ia-ivory)" }) => (
  <div className="relative h-px w-full bg-[var(--ia-rule)]">
    <span
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-[var(--ia-bronze)] text-[11px] tracking-[0.4em]"
      style={{ background: bg }}
    >
      {glyph}
    </span>
  </div>
);

/* ── Apply Drawer ────────────────────────────────────────────────────────── */

const Field = ({ label, htmlFor, optional, children }) => (
  <div>
    <label htmlFor={htmlFor} className="flex items-baseline justify-between mb-2">
      <span className="eyebrow">{label}</span>
      {optional && <span className="text-[10px] italic text-[var(--ia-ink-mute)]">Optional</span>}
    </label>
    {children}
  </div>
);

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
    if (!open) { setDone(null); setErr(null); }
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
      const res = await axios.post(`${API}/applications`, payload);
      setDone(res.data.message || "Application received.");
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
        className={`fixed inset-0 z-[90] bg-[var(--ia-ink)] transition-opacity duration-500 ${open ? "opacity-50" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Apply for The Author's Forge"
        className={`fixed top-0 right-0 h-full z-[100] w-full max-w-[560px] bg-[var(--ia-ivory-warm)] border-l hairline flex flex-col transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between p-8 sm:p-10 border-b hairline shrink-0">
          <div>
            <Eyebrow className="text-[var(--ia-bronze-deep)]">The Author's Forge — Apply</Eyebrow>
            <div className="font-display text-4xl sm:text-5xl leading-[0.95] mt-3">
              Apply for<br /><em className="font-display-italic">the Forge</em>
            </div>
            <div className="mt-3 text-sm text-[var(--ia-ink-mute)] italic">Electric Cohort — 4 spots remaining</div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="w-11 h-11 border hairline flex items-center justify-center text-[var(--ia-ink)] hover:bg-[var(--ia-ink)] hover:text-[var(--ia-ivory-warm)]"
          >
            <X size={16} strokeWidth={1.2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <form noValidate onSubmit={submit} className="p-8 sm:p-10 flex flex-col gap-8">
            <Field label="Full Name" htmlFor="af-name">
              <input id="af-name" required autoComplete="name" placeholder="Jane Smith" type="text" className="atelier-input" />
            </Field>
            <Field label="Email Address" htmlFor="af-email">
              <input id="af-email" required autoComplete="email" placeholder="jane@example.com" type="email" className="atelier-input" />
            </Field>
            <Field label="Area of Expertise" htmlFor="af-expertise">
              <select id="af-expertise" required defaultValue="" className="atelier-input">
                <option value="" disabled>Select your field</option>
                <option>Executive Leadership</option>
                <option>Business Strategy</option>
                <option>Sales &amp; Marketing</option>
                <option>Health &amp; Wellness Coaching</option>
                <option>Personal Development</option>
                <option>Finance &amp; Wealth</option>
                <option>Spiritual Entrepreneurship</option>
                <option>Life Coaching</option>
                <option>Legal or Professional Services</option>
                <option>Technology &amp; Innovation</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Your Book Concept" htmlFor="af-concept">
              <textarea id="af-concept" required rows={4} placeholder="What's your book about? Who's it for? What problem does it solve?" className="atelier-input" />
            </Field>
            <Field label="Where Are You Right Now?" htmlFor="af-stage" optional>
              <select id="af-stage" defaultValue="" className="atelier-input">
                <option value="">Select your current stage (optional)</option>
                <option>I have a complete outline</option>
                <option>I have rough notes and ideas</option>
                <option>I know my topic but nothing written</option>
                <option>I have a vague concept</option>
                <option>I don't know where to start yet</option>
              </select>
            </Field>
            <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full disabled:opacity-60 disabled:cursor-not-allowed">
              <span>{submitting ? "Submitting…" : "Submit Application"}</span>
              <Feather size={14} strokeWidth={1.4} className="relative -mt-px" />
            </button>
            {done && (
              <p className="text-sm italic text-[var(--ia-forest)] text-center mt-2">✦ {done}</p>
            )}
            {err && (
              <p className="text-sm italic text-red-700 text-center mt-2">{err}</p>
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

/* ── Section 1: The Anchor ───────────────────────────────────────────────── */

const AnchorSection = ({ onApply }) => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1000px] mx-auto px-6 sm:px-12 py-24 sm:py-32 flex flex-col items-center text-center">
      <FolioNumber label="Tipped-in № vii" />
      <h1 className="mt-8 font-display text-[52px] sm:text-[80px] leading-[0.95]">
        The <em className="font-display-italic text-[var(--ia-forest)]">Investment</em>
      </h1>
      <p className="mt-6 font-display-italic text-[20px] sm:text-[24px] text-[var(--ia-ink-soft)]">
        What it costs to become the published authority in your field
      </p>

      <div className="mt-12 max-w-2xl text-[var(--ia-ink-soft)] text-lg leading-relaxed space-y-4">
        <p>
          The Author's Forge is a premium editorial residency designed for Indian experts who are
          serious about publishing their expertise.
        </p>
        <p>
          In the Indian publishing ecosystem, a professionally edited, designed, and distributed book
          typically costs ₹3,00,000–₹5,00,000 through traditional channels — often with no guarantee
          of quality, voice, or editorial integrity.
        </p>
        <p>
          The Forge delivers publication-grade authority in five months, with end-to-end editorial
          mastery, for a structured investment that respects the Indian professional's reality.
        </p>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <span className="font-display text-[80px] sm:text-[120px] leading-none text-[var(--ia-ink)] tabular-nums">
          $3,000
        </span>
        <span className="mt-2 font-display-italic text-[22px] text-[var(--ia-bronze-deep)]">
          Approximately ₹2,50,000
        </span>
        <div className="mt-8 w-[40%] max-w-xs">
          <div className="h-px bg-[var(--ia-bronze)] opacity-60" />
        </div>
        <p className="mt-6 max-w-xl text-sm text-[var(--ia-ink-mute)] italic leading-relaxed">
          This includes everything: manuscript development, publishing execution, launch strategy,
          and 12 months of ongoing authority content. No hidden costs. No surprise add-ons.
        </p>
      </div>

      <button onClick={onApply} className="btn-primary mt-14 px-12 py-5">
        <span>Apply for the Electric Cohort</span>
        <ArrowRight size={14} strokeWidth={1.3} />
      </button>
    </div>
  </section>
);

/* ── Section 2: The Philosophy ───────────────────────────────────────────── */

const PhilosophySection = () => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--ia-rule)]">

        <div className="bg-[var(--ia-ivory)] p-10 sm:p-16 lg:p-20">
          <Eyebrow className="text-[var(--ia-ink-mute)]">The Indian Publishing Reality</Eyebrow>
          <h2 className="mt-6 font-display text-[32px] sm:text-[44px] leading-[1.0]">
            The Cost of <em className="font-display-italic text-[var(--ia-bronze-deep)]">Waiting</em>
          </h2>

          <div className="mt-10 space-y-8">
            {[
              {
                label: "Traditional publishing",
                body: "Years of waiting, minimal editorial support, and no guarantee your book will ever see the light of day. The gatekeepers decide. You wait.",
              },
              {
                label: "Self-publishing alone",
                body: "You become a project manager, not an author. Chasing designers, typesetters, and distributors — while your expertise sits unpublished and your authority unclaimed.",
              },
              {
                label: "The ₹50,000 ghostwriter",
                body: "You receive a generic manuscript that sounds like everyone else. No voice. No architecture. No launch strategy. Just a book that gathers dust.",
              },
              {
                label: "Doing nothing",
                body: "You remain the best-kept secret in your industry. Explaining your expertise on every call. Competing on price. One of hundreds in your category.",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-5">
                <span className="mt-1 w-5 h-5 border hairline rounded-full shrink-0 flex items-center justify-center text-[var(--ia-ink-mute)]">
                  <X size={10} strokeWidth={1.3} />
                </span>
                <div>
                  <div className="font-display text-[18px] leading-tight">{item.label}</div>
                  <p className="mt-2 text-[var(--ia-ink-soft)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--ia-ivory-deep)] p-10 sm:p-16 lg:p-20">
          <Eyebrow className="text-[var(--ia-forest)]">The Forge</Eyebrow>
          <h2 className="mt-6 font-display text-[32px] sm:text-[44px] leading-[1.0]">
            The Return on <em className="font-display-italic text-[var(--ia-forest)]">Authority</em>
          </h2>

          <div className="mt-10 space-y-8">
            {[
              {
                label: "Five months to published author",
                body: "A manuscript that sounds like you — not a template. A publishing package that looks like it came from a major house.",
              },
              {
                label: "60-piece launch arsenal",
                body: "Social posts, email sequences, podcast pitches, and webinar scripts — derived from your manuscript and curated for the Indian digital ecosystem.",
              },
              {
                label: "Twelve months of authority content",
                body: "Ongoing thought leadership: LinkedIn essays, newsletter articles, keynote variations, and course outlines — tailored for your audience.",
              },
              {
                label: "Permanent third-party validation",
                body: "Your book pre-sells your expertise before the call begins. It filters premium clients from price shoppers. It outlives algorithms and trend cycles.",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-5">
                <span className="mt-1 w-5 h-5 border border-[var(--ia-forest)] rounded-full shrink-0 flex items-center justify-center text-[var(--ia-forest)]">
                  <Check size={10} strokeWidth={1.5} />
                </span>
                <div>
                  <div className="font-display text-[18px] leading-tight">{item.label}</div>
                  <p className="mt-2 text-[var(--ia-ink-soft)] leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t hairline">
            <p className="font-display-italic text-[18px] text-[var(--ia-ink-soft)] leading-relaxed">
              Whether you are a spiritual entrepreneur, a life coach, a consultant, or a content
              creator — your expertise deserves a book that carries your name with pride.
            </p>
            <p className="mt-4 font-display-italic text-[16px] text-[var(--ia-forest)]">
              The question is not whether you can afford the Forge. The question is whether you
              can afford to let your best thinking remain invisible.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center font-display-italic text-[17px] text-[var(--ia-ink-mute)]">
        The editor amplifies your voice. The machine handles the logistics. You provide the wisdom.
      </div>
    </div>
  </section>
);

/* ── Section 3: What Is Included ─────────────────────────────────────────── */

const INCLUSIONS = [
  {
    icon: FileText,
    title: "End-to-End Manuscript Development",
    body: "Complete editorial mastery from idea to final draft. The Architecture, The Writing Forge, and The Three Gates.",
  },
  {
    icon: BookOpen,
    title: "Professional Publishing Package",
    body: "Cover design (3 finalists, your selection), interior typesetting, ISBN registration, and India + global distribution setup.",
  },
  {
    icon: Megaphone,
    title: "The 60-Piece Launch Arsenal",
    body: "Social posts, email sequences, podcast pitches, webinar scripts — derived from your manuscript and curated for the Indian digital ecosystem.",
  },
  {
    icon: Star,
    title: "The 12-Month Authority Engine",
    body: "Ongoing thought leadership content: LinkedIn essays, newsletter articles, keynote variations, and course outlines — tailored for your audience.",
  },
  {
    icon: Calendar,
    title: "Weekly Live Masterclasses",
    body: "Cohort-wide sessions on craft, positioning, and publishing strategy. Peer learning from 10–12 serious Indian experts.",
  },
  {
    icon: Users,
    title: "Monthly 1:1 Strategy Calls",
    body: "Private editorial conversations with Hersh Bhardwaj. Your manuscript, your business case, your authority trajectory.",
  },
];

const ADDITIONAL = [
  "Private author portal and community",
  "The Voice DNA style guide",
  "The Voice Audit Guarantee",
  "Advance review copy distribution (Indian + international contacts)",
  "Amazon India and global metadata optimisation",
  "Legal framework and contract templates",
  "Post-publication authority strategy and sequencing",
  "Hindi/English bilingual consultation (if applicable)",
];

const InclusionsSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center mb-16">
        <FolioNumber label="№ 07" />
        <h2 className="mt-6 font-display text-[44px] sm:text-[72px] leading-[0.95]">
          What Is <em className="font-display-italic text-[var(--ia-forest)]">Included</em>
        </h2>
        <p className="mt-4 font-display-italic text-lg text-[var(--ia-ink-mute)]">
          Every element of the residency, from extraction to authority
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--ia-rule)] border hairline">
        {INCLUSIONS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-[var(--ia-ivory-warm)] p-8 sm:p-10 flex flex-col gap-4 hover:bg-[var(--ia-ivory-deep)] transition-colors duration-300">
              <Icon size={22} strokeWidth={1.1} className="text-[var(--ia-bronze-deep)]" />
              <div className="font-display text-[22px] leading-tight">{item.title}</div>
              <p className="text-sm text-[var(--ia-ink-mute)] leading-relaxed flex-1">{item.body}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 border hairline p-8 sm:p-10">
        <Eyebrow className="block mb-6 text-[var(--ia-bronze-deep)]">Additional Inclusions</Eyebrow>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ADDITIONAL.map((item) => (
            <li key={item} className="flex items-baseline gap-3 text-sm text-[var(--ia-ink-soft)]">
              <span className="text-[var(--ia-bronze)] shrink-0">✦</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/* ── Section 4: What Is Not Included ─────────────────────────────────────── */

const ExclusionsSection = () => (
  <section className="bg-[var(--ia-ivory-deep)] border-b hairline">
    <div className="max-w-[760px] mx-auto px-6 sm:px-12 py-20 sm:py-28">
      <h2 className="font-display text-[32px] sm:text-[48px] leading-[0.95] text-center">
        What Is <em className="font-display-italic text-[var(--ia-ink-soft)]">Not Included</em>
      </h2>
      <p className="mt-6 text-center text-[var(--ia-ink-mute)] italic">
        We believe in transparent scope. The following are not included in the residency investment:
      </p>

      <div className="mt-12 space-y-8">
        {[
          {
            label: "Printing costs",
            body: "If you choose print-on-demand, we manage the setup and logistics. The printing itself is paid directly to the printer.",
          },
          {
            label: "External marketing spend",
            body: "We provide the launch arsenal and the strategy. Paid advertising, PR firm retainers, and influencer collaborations are outside the residency.",
          },
          {
            label: "Travel and event costs",
            body: "Book launches, speaking tours, and live events are yours to plan. We provide the content. You provide the presence.",
          },
          {
            label: "Ghostwriting",
            body: "We do not write your book for you. We extract your expertise, refine your voice, and guarantee your authorship. The manuscript is yours in every sense.",
          },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-6 pb-8 border-b hairline last:border-b-0 last:pb-0">
            <span className="font-display tabular text-[11px] tracking-[0.3em] text-[var(--ia-ink-mute)] uppercase shrink-0 mt-1 w-6 text-right">—</span>
            <div>
              <div className="font-display text-[20px] leading-tight">{item.label}</div>
              <p className="mt-2 text-[var(--ia-ink-soft)] leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm italic text-[var(--ia-ink-mute)]">
        If you are seeking a done-for-you book that you did not write, the Forge is not the right fit.
      </p>
    </div>
  </section>
);

/* ── Section 5: Payment Options ──────────────────────────────────────────── */

const PAYMENT_PLANS = [
  {
    label: "Three Installments",
    price: "$1,000 × 3",
    inr: "₹83,000 × 3",
    schedule: "Payable at Month 1, Month 2, Month 4",
    best: "Managing cash flow across the residency",
    featured: false,
  },
  {
    label: "Full Payment",
    price: "$3,000",
    inr: "₹2,50,000",
    schedule: "Single payment, 10% discount applied",
    best: "Authors ready to commit fully",
    featured: true,
  },
  
];

const PaymentSection = ({ onApply }) => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center mb-16">
        <h2 className="font-display text-[44px] sm:text-[72px] leading-[0.95]">
          Payment <em className="font-display-italic text-[var(--ia-forest)]">Options</em>
        </h2>
        <p className="mt-4 font-display-italic text-lg text-[var(--ia-ink-mute)]">
          Structured to match your cash flow and commitment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--ia-rule)] border hairline">
        {PAYMENT_PLANS.map((plan) => (
          <div
            key={plan.label}
            className={`flex flex-col p-8 sm:p-10 ${plan.featured ? "bg-[var(--ia-forest)] text-[var(--ia-ivory-warm)]" : "bg-[var(--ia-ivory-warm)]"}`}
          >
            {plan.featured && (
              <span className="eyebrow text-[var(--ia-bronze)] mb-4">Most Popular</span>
            )}
            <div className={`font-display text-[13px] tracking-[0.25em] uppercase ${plan.featured ? "text-[var(--ia-bronze)]" : "text-[var(--ia-ink-mute)]"}`}>
              {plan.label}
            </div>
            <div className="mt-4 font-display text-[40px] sm:text-[52px] leading-none">
              {plan.price}
            </div>
            <div className={`mt-2 font-display-italic text-[20px] ${plan.featured ? "text-[var(--ia-bronze)]" : "text-[var(--ia-bronze-deep)]"}`}>
              {plan.inr}
            </div>
            <div className={`mt-1 h-px ${plan.featured ? "bg-white/20" : "bg-[var(--ia-rule)]"} my-6`} />
            <p className={`text-sm leading-relaxed ${plan.featured ? "text-white/80" : "text-[var(--ia-ink-mute)]"}`}>
              {plan.schedule}
            </p>
            <div className={`mt-4 text-[10px] tracking-[0.3em] uppercase ${plan.featured ? "text-[var(--ia-bronze)]" : "text-[var(--ia-ink-mute)]"}`}>
              Best for
            </div>
            <p className={`mt-1 text-sm leading-relaxed flex-1 ${plan.featured ? "text-white/80" : "text-[var(--ia-ink-mute)]"}`}>
              {plan.best}
            </p>
            <button
              onClick={onApply}
              className={`mt-8 h-11 flex items-center justify-center gap-3 text-[11px] tracking-[0.25em] uppercase border transition-colors ${plan.featured ? "border-[var(--ia-bronze)] text-[var(--ia-bronze)] hover:bg-[var(--ia-bronze)] hover:text-[var(--ia-forest)]" : "border-[var(--ia-ink)] text-[var(--ia-ink)] hover:bg-[var(--ia-ink)] hover:text-[var(--ia-ivory-warm)]"}`}
            >
              Apply Now <ArrowRight size={12} strokeWidth={1.3} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 border hairline p-8 text-sm text-[var(--ia-ink-soft)] leading-relaxed">
        <p>
          <strong className="font-display text-[15px]">Payment Methods —</strong>{" "}
          We accept all major Indian payment methods: UPI, bank transfer, credit/debit card, and
          EMI options (where applicable). International authors may pay via wire transfer or PayPal.
        </p>
        <p className="mt-3 italic text-[var(--ia-ink-mute)]">
          All payment plans require a signed agreement and deposit to hold your cohort seat.
          Deposits are fully refundable for 7 days.
        </p>
      </div>
    </div>
  </section>
);

/* ── Section 6: The Guarantee ────────────────────────────────────────────── */

const GuaranteeSection = () => (
  <section className="bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] py-28 sm:py-40 px-6 sm:px-12">
    <div className="max-w-[760px] mx-auto flex flex-col items-center text-center">
      <FolioNumber label="Tipped-in № vi" />
      <div className="mt-4 text-[var(--ia-bronze)] text-xs tracking-[0.4em] uppercase">
        — The Author's Forge Editorial Board
      </div>

      <h2 className="mt-12 font-display text-[44px] sm:text-[72px] leading-[0.95]">
        The Voice Audit<br />
        <em className="font-display-italic text-[var(--ia-bronze)]">Guarantee</em>
      </h2>

      <div className="mt-10 w-24 relative">
        <div className="h-px bg-[var(--ia-bronze)] opacity-40" />
      </div>

      <p className="mt-10 text-lg sm:text-xl leading-relaxed text-white/80 max-w-xl">
        We guarantee that no chapter in your manuscript will sound like it was written by someone else.
      </p>
      <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-xl">
        If any passage fails the Voice Gate — if it lacks the specificity, rhythm, and irreducible
        humanity of your authentic voice — we rewrite it at our expense.
      </p>
      <p className="mt-8 font-display-italic text-[18px] text-[var(--ia-bronze)]">
        This is not a promise we make lightly. We make it because we have never had to honor it.
      </p>
    </div>
  </section>
);

/* ── Section 7: The Conversation Gate ───────────────────────────────────── */

const ConversationSection = ({ onApply }) => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[900px] mx-auto px-6 sm:px-12 py-24 sm:py-32 flex flex-col items-center text-center">
      <h2 className="font-display text-[44px] sm:text-[64px] leading-[0.95]">
        The Next <em className="font-display-italic text-[var(--ia-forest)]">Step</em>
      </h2>

      <div className="mt-10 w-24"><RuleOrnament glyph="✦" bg="var(--ia-ivory-warm)" /></div>

      <div className="mt-10 max-w-xl text-lg text-[var(--ia-ink-soft)] leading-relaxed space-y-4">
        <p>
          If you are a serious Indian expert — spiritual entrepreneur, coach, consultant, or content
          creator — and you have been sitting on a book idea, we invite you to apply for the Electric Cohort.
        </p>
        <p>
          The Forge is not for everyone. It is for those who are ready to transform their expertise into
          permanent authority. We review every application personally.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <button onClick={onApply} className="btn-primary px-10 py-4">
          <span>Apply for the Electric Cohort</span>
          <ArrowRight size={14} strokeWidth={1.3} />
        </button>
        <Link
          to="/"
          className="btn-ghost px-10 py-4"
        >
          <ArrowLeft size={14} strokeWidth={1.3} />
          <span>Back to the residency</span>
        </Link>
      </div>

      <p className="mt-8 text-xs italic text-[var(--ia-ink-mute)]">
        Applications reviewed within 48 hours. We review every application personally.
        There is no algorithm between your words and our judgment.
      </p>
    </div>
  </section>
);

/* ── Section 8: Footer ───────────────────────────────────────────────────── */

const InvestmentFooter = ({ onApply }) => (
  <footer className="bg-[var(--ia-ivory)] border-t hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 text-sm">
          <Link to="/" className="flex items-center gap-2 text-[var(--ia-ink-mute)] hover:text-[var(--ia-ink)] transition-colors">
            <ArrowRight size={11} strokeWidth={1.2} className="rotate-180" />
            <span className="italic">Read the residency overview</span>
          </Link>
          <button onClick={onApply} className="flex items-center gap-2 text-[var(--ia-ink-mute)] hover:text-[var(--ia-ink)] transition-colors italic">
            <ArrowRight size={11} strokeWidth={1.2} />
            <span>Apply for the residency</span>
          </button>
        </div>
        <div>
          <span className="font-display tabular text-[11px] tracking-[0.35em] text-[var(--ia-bronze)] uppercase">
            Five-month residency · 10–12 authors · Designed for Indian experts · MMXXIV
          </span>
        </div>
      </div>
    </div>
  </footer>
);

/* ── Nav bar ─────────────────────────────────────────────────────────────── */

const InvestmentNav = ({ onApply }) => (
  <nav className="sticky top-0 z-50 bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] border-b border-white/10">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-3 text-[var(--ia-bronze)] hover:text-[var(--ia-ivory-warm)] transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={1.2} />
        <span className="eyebrow text-[var(--ia-ivory-warm)]/60">The Author's Forge</span>
      </Link>
      <span className="font-display-italic text-[18px] text-[var(--ia-ivory-warm)]">
        The Investment
      </span>
      <button
        onClick={onApply}
        className="hidden sm:flex items-center gap-3 eyebrow text-[var(--ia-bronze)] hover:text-[var(--ia-ivory-warm)] transition-colors"
      >
        Apply <ArrowRight size={12} strokeWidth={1.3} />
      </button>
    </div>
  </nav>
);

/* ── Root ────────────────────────────────────────────────────────────────── */

export default function InvestmentPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.title = "The Investment | The Author's Forge · Electric Cohort · India";
  }, []);

  const onApply = () => setDrawerOpen(true);

  return (
    <div className="min-h-screen bg-[var(--ia-ivory)] text-[var(--ia-ink)] selection:bg-[var(--ia-forest)] selection:text-[var(--ia-ivory-warm)] overflow-x-hidden">
      <ApplyDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <InvestmentNav onApply={onApply} />
      <AnchorSection onApply={onApply} />
      <PhilosophySection />
      <InclusionsSection />
      <ExclusionsSection />
      <PaymentSection onApply={onApply} />
      <GuaranteeSection />
      <ConversationSection onApply={onApply} />
      <InvestmentFooter onApply={onApply} />
    </div>
  );
}
