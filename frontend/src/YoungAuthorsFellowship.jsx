import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Feather, GraduationCap, Mail, Linkedin, Users } from "lucide-react";

const Eyebrow = ({ children, className = "" }) => (
  <span className={`eyebrow ${className}`}>{children}</span>
);

const FolioNumber = ({ n }) => (
  <span className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-ink-mute)] uppercase">
    №&nbsp;{String(n).padStart(2, "0")}
  </span>
);

const RuleOrnament = ({ glyph = "✦" }) => (
  <div className="relative h-px w-full bg-[var(--ia-rule)]">
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--ia-ivory)] px-4 text-[var(--ia-bronze)] text-[11px] tracking-[0.4em]">
      {glyph}
    </span>
  </div>
);

const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 h-16 flex items-center justify-between">
      <Link to="/" className="font-display text-xl text-[var(--ia-ink)] hover:text-[var(--ia-forest)] transition-colors">
        The Author's Forge
      </Link>
      <div className="hidden lg:flex items-center gap-8">
        <Link to="/" className="eyebrow text-[11px] tracking-[0.2em] uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-forest)] transition-colors">Home</Link>
        <Link to="/mentor" className="eyebrow text-[11px] tracking-[0.2em] uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-forest)] transition-colors">Mentor</Link>
        <Link to="/investment" className="eyebrow text-[11px] tracking-[0.2em] uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-forest)] transition-colors">Investment</Link>
        <Link to="/shreem-books" className="eyebrow text-[11px] tracking-[0.2em] uppercase text-[var(--ia-ink-mute)] hover:text-[var(--ia-forest)] transition-colors">Catalogue</Link>
        <span className="eyebrow text-[11px] tracking-[0.2em] uppercase text-[var(--ia-forest)]">Young Authors</span>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline pt-16">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="max-w-4xl">
        <FolioNumber n={1} />
        <h1 className="mt-6 font-display text-[48px] sm:text-[72px] lg:text-[88px] leading-[0.95]">
          The Young Authors<br />
          <em className="font-display-italic text-[var(--ia-forest)]">Fellowship</em>
        </h1>
        <div className="mt-10 w-20"><RuleOrnament /></div>
        <p className="mt-10 text-xl sm:text-2xl leading-relaxed text-[var(--ia-ink-soft)] max-w-2xl">
          A fully sponsored book publishing initiative for schools. Ten exceptional student writers. One extraordinary year. Zero fees.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-start gap-4">
          <a href="mailto:hersh.bhardwaj@gmail.com?subject=Young%20Authors%20Fellowship%20Enquiry" className="btn-primary">
            <span>Enquire for Your School</span>
            <ArrowRight size={14} strokeWidth={1.3} />
          </a>
          <Link to="/" className="btn-ghost">
            <span>Return to Home</span>
            <ArrowRight size={14} strokeWidth={1.3} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const ProposalSection = () => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={2} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            The<br />
            <em className="font-display-italic text-[var(--ia-forest)]">Proposal</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <div className="space-y-6 text-lg leading-relaxed text-[var(--ia-ink-soft)]">
            <p>Every school has students with extraordinary ideas, stories, research, poetry, and imagination.</p>
            <p className="font-display text-xl text-[var(--ia-ink)]">Very few ever finish a book.</p>
            <p>The Authors Forge Young Authors Fellowship is a fully sponsored annual programme that identifies ten exceptional student writers and mentors them from idea to published book.</p>
            <p>There are no fees for the selected students or the school.</p>
            <blockquote className="border-l-2 border-[var(--ia-bronze)] pl-6 py-2 my-8 italic text-[var(--ia-ink)]">
              The fellowship is funded entirely by Authors Forge as part of its commitment to nurturing India's next generation of authors.
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const OBJECTIVES = [
  "Discover talented young writers",
  "Build discipline through a structured writing process",
  "Improve writing, research and communication skills",
  "Publish ten professionally produced books",
  "Create a lasting literary legacy for the school"
];

const ObjectivesSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={3} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            Our<br />
            <em className="font-display-italic text-[var(--ia-forest)]">Objectives</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <div className="space-y-6">
            {OBJECTIVES.map((obj, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="font-display tabular text-[var(--ia-bronze)] text-lg mt-0.5">✦</span>
                <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DELIVERABLES = [
  { label: "Professional mentoring", icon: "Users" },
  { label: "Book planning workshops", icon: "BookOpen" },
  { label: "Weekly accountability sessions", icon: "Feather" },
  { label: "Editorial guidance", icon: "BookOpen" },
  { label: "Professional proofreading", icon: "BookOpen" },
  { label: "Cover design", icon: "BookOpen" },
  { label: "Interior typesetting", icon: "BookOpen" },
  { label: "ISBN allocation", icon: "BookOpen" },
  { label: "Paperback publication", icon: "BookOpen" },
  { label: "Distribution on Amazon India", icon: "BookOpen" },
  { label: "Author certificate", icon: "GraduationCap" },
  { label: "Book launch event", icon: "BookOpen" },
];

const ICON_MAP = { Users, BookOpen, Feather, GraduationCap };

const DeliverablesSection = () => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <FolioNumber n={4} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          What Students <em className="font-display-italic text-[var(--ia-forest)]">Receive</em>
        </h2>
        <p className="mt-6 text-lg text-[var(--ia-ink-mute)] italic">Each selected fellow receives:</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 max-w-5xl mx-auto">
        {DELIVERABLES.map((item, i) => {
          const Icon = ICON_MAP[item.icon] || BookOpen;
          return (
            <div key={i} className="flex items-center gap-4 py-3 border-b hairline">
              <Icon size={18} strokeWidth={1.3} className="text-[var(--ia-bronze)] shrink-0" />
              <span className="text-lg text-[var(--ia-ink-soft)]">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const TIMELINE = [
  { month: "Month 1", title: "Foundation", body: "Idea selection, book blueprint and writing plan." },
  { month: "Months 2–4", title: "The Forge", body: "Weekly mentoring and manuscript completion." },
  { month: "Month 5", title: "Production", body: "Editing, design and production." },
  { month: "Month 6", title: "Publication", body: "Publication and school book launch." },
];

const TimelineSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <FolioNumber n={5} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          Fellowship <em className="font-display-italic text-[var(--ia-forest)]">Timeline</em>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TIMELINE.map((item, i) => (
          <div key={i} className="border hairline p-8 bg-[var(--ia-ivory)]">
            <div className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-bronze-deep)] uppercase mb-4">{item.month}</div>
            <h3 className="font-display text-2xl leading-tight mb-4">{item.title}</h3>
            <p className="text-[var(--ia-ink-soft)] leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SELECTION = [
  "500-word writing sample",
  "Personal statement",
  "Book idea",
  "Teacher recommendation"
];

const SelectionSection = () => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={6} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            Selection<br />
            <em className="font-display-italic text-[var(--ia-forest)]">Process</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)] mb-8">Students submit:</p>
          <div className="space-y-4">
            {SELECTION.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="font-display tabular text-[var(--ia-bronze)] text-lg mt-0.5">✦</span>
                <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-lg leading-relaxed text-[var(--ia-ink-soft)] italic">
            The final ten fellows are selected jointly by Authors Forge and the school.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const BENEFITS = [
  "Ten published student authors every year",
  "National recognition as a school that nurtures young authors",
  "Published books for the school library",
  "Enhanced student portfolios for university applications",
  "Increased parent engagement",
  "Media and social media coverage",
  "Annual Young Authors Showcase"
];

const BenefitsSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={7} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            School<br />
            <em className="font-display-italic text-[var(--ia-forest)]">Benefits</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)] mb-8">The school receives:</p>
          <div className="space-y-4">
            {BENEFITS.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="font-display tabular text-[var(--ia-bronze)] text-lg mt-0.5">✦</span>
                <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const GENRES = [
  "Novels", "Short stories", "Science", "History", "Entrepreneurship",
  "Personal development", "Poetry", "Social issues", "Environmental projects", "Indian culture"
];

const EligibilitySection = () => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={8} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            <em className="font-display-italic text-[var(--ia-forest)]">Eligibility</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)] mb-6">
            Students from <strong className="text-[var(--ia-ink)]">Classes VIII–XII</strong>.
          </p>
          <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)] mb-6">
            Both fiction and non-fiction are welcome. Books may include:
          </p>
          <div className="flex flex-wrap gap-3">
            {GENRES.map((g, i) => (
              <span key={i} className="px-4 py-2 border hairline text-sm text-[var(--ia-ink-soft)] hover:border-[var(--ia-forest)] hover:text-[var(--ia-forest)] transition-colors cursor-default">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ScholarshipSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center max-w-2xl mx-auto">
        <FolioNumber n={9} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          The <em className="font-display-italic text-[var(--ia-forest)]">Scholarship</em>
        </h2>
        <div className="mt-10 w-20 mx-auto"><RuleOrnament /></div>
        <div className="mt-12 space-y-4">
          <p className="font-display text-3xl text-[var(--ia-ink)]">100% scholarship.</p>
          <p className="text-lg text-[var(--ia-ink-soft)]">No tuition fees.</p>
          <p className="text-lg text-[var(--ia-ink-soft)]">No mentoring fees.</p>
          <p className="text-lg text-[var(--ia-ink-soft)]">No publishing fees.</p>
          <p className="text-lg text-[var(--ia-ink-soft)] italic">Students retain full credit as authors.</p>
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section className="bg-[var(--ia-ivory)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={10} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            About<br />
            <em className="font-display-italic text-[var(--ia-forest)]">Authors Forge</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">
            Authors Forge is a structured mentoring and publishing programme that helps aspiring authors transform ideas into professionally published books through expert guidance, accountability and world-class publishing standards.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const VisionSection = () => (
  <section className="bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] border-b border-[var(--ia-forest-deep)]">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center max-w-3xl mx-auto">
        <span className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-bronze)] uppercase">№ 11</span>
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          The <em className="font-display-italic text-[var(--ia-forest)]">Vision</em>
        </h2>
        <div className="mt-10 w-20 mx-auto">
          <div className="relative h-px w-full bg-[var(--ia-forest-deep)]">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--ia-ink)] px-4 text-[var(--ia-bronze)] text-[11px] tracking-[0.4em]">✦</span>
          </div>
        </div>
        <p className="mt-12 text-xl sm:text-2xl leading-relaxed italic">
          Imagine every graduating batch leaving behind not only memories, but books.
        </p>
        <p className="mt-8 text-lg leading-relaxed text-[var(--ia-ivory-deep)]">
          Within five years, the school becomes home to fifty published student authors.
        </p>
        <blockquote className="mt-10 border-l-2 border-[var(--ia-bronze)] pl-6 py-2 italic text-xl leading-relaxed max-w-2xl mx-auto text-left">
          That legacy cannot be replicated through competitions or certificates.
        </blockquote>
      </div>
    </div>
  </section>
);

const FellowshipFooter = () => (
  <footer className="bg-[var(--ia-ivory)] py-16 px-6 sm:px-12 lg:px-20 border-t hairline">
    <div className="max-w-[1480px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm text-[var(--ia-ink-mute)]">
      <div>
        <div className="font-display text-2xl text-[var(--ia-ink)]">The Author's Forge</div>
        <div className="mt-2 italic">Young Authors Fellowship</div>
      </div>
      <div className="flex flex-col gap-3">
        <a href="mailto:hersh.bhardwaj@gmail.com" className="flex items-center gap-2 hover:text-[var(--ia-forest)] transition-colors">
          <Mail size={14} strokeWidth={1.3} /> hersh.bhardwaj@gmail.com
        </a>
        <a href="https://linkedin.com/in/hershbhardwaj" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--ia-forest)] transition-colors">
          <Linkedin size={14} strokeWidth={1.3} /> linkedin.com/in/hershbhardwaj
        </a>
      </div>
      <div className="sm:text-right">
        <Eyebrow>Authors Forge</Eyebrow>
        <div className="mt-3 italic">Made in India for the World</div>
        <div className="mt-2 font-display tabular text-2xl text-[var(--ia-ink)]">MMXXIV</div>
      </div>
    </div>
  </footer>
);

export default function YoungAuthorsFellowship() {
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
    <div className="min-h-screen bg-[var(--ia-ivory)] text-[var(--ia-ink)] selection:bg-[var(--ia-forest)] selection:text-[var(--ia-ivory-warm)] overflow-x-hidden">
      <NavBar />
      <div className="reveal-in"><HeroSection /></div>
      <div className="reveal-in"><ProposalSection /></div>
      <div className="reveal-in"><ObjectivesSection /></div>
      <div className="reveal-in"><DeliverablesSection /></div>
      <div className="reveal-in"><TimelineSection /></div>
      <div className="reveal-in"><SelectionSection /></div>
      <div className="reveal-in"><BenefitsSection /></div>
      <div className="reveal-in"><EligibilitySection /></div>
      <div className="reveal-in"><ScholarshipSection /></div>
      <div className="reveal-in"><AboutSection /></div>
      <div className="reveal-in"><VisionSection /></div>
      <FellowshipFooter />
    </div>
  );
}
