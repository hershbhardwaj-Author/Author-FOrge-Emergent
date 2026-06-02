import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Feather, Mail, Linkedin } from "lucide-react";

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
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--ia-ivory-warm)] px-4 text-[var(--ia-bronze)] text-[11px] tracking-[0.4em]">
      {glyph}
    </span>
  </div>
);

const PortraitSection = ({ onApply }) => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] bg-[var(--ia-ink)] flex items-center justify-center border hairline overflow-hidden">
  <img
    src="/mentor-portrait.jpg"
    alt="Harshit Bhardwaj"
    className="w-full h-full object-cover"
  />
</div>
          <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-[var(--ia-forest)] flex items-center justify-center text-[var(--ia-ivory-warm)] font-display text-xs tracking-[0.3em] uppercase border hairline">
            Mentor<br />& Editor
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <FolioNumber n={1} />
          <h1 className="mt-6 font-display text-[48px] sm:text-[72px] leading-[0.95]">
            The Editor<br />
            <em className="font-display-italic text-[var(--ia-forest)]">behind the Forge</em>
          </h1>
          <div className="mt-10 w-20"><RuleOrnament /></div>
          <p className="mt-10 text-lg leading-relaxed text-[var(--ia-ink-soft)] italic max-w-lg">
            Every serious expert deserves a book that carries their name with pride.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <button onClick={onApply} className="btn-primary">
              <span>Apply for the Forge</span>
              <ArrowRight size={14} strokeWidth={1.3} />
            </button>
            <Link to="/" className="btn-ghost">
              <span>Return to Home</span>
              <ArrowRight size={14} strokeWidth={1.3} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const OriginSection = () => (
  <section className="bg-[var(--ia-ivory)] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-b hairline">
    <div className="max-w-[1480px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <FolioNumber n={2} />
          <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
            Why I Built<br />
            <em className="font-display-italic text-[var(--ia-forest)]">the Forge</em>
          </h2>
          <div className="mt-10 w-16"><RuleOrnament /></div>
        </div>
        <div className="lg:col-span-8 lg:pl-12 lg:border-l hairline">
          <div className="space-y-6 text-lg leading-relaxed text-[var(--ia-ink-soft)]">
            <p>I spent fifteen years watching the publishing industry fail the people who needed it most.</p>
            <p>The spiritual thinker in Varanasi with a lifetime of wisdom and no path to publication. The consultant in Delhi with a methodology that could change her industry and no manuscript to prove it. The founder in Bangalore building something extraordinary and no book to anchor his authority.</p>
            <p>They were either priced out of traditional publishing or drowning in the self-publishing swamp — cheap covers, ghostwritten prose that sounded like everyone else, and books that launched quietly and disappeared.</p>
            <blockquote className="border-l-2 border-[var(--ia-bronze)] pl-6 py-2 my-8 italic text-[var(--ia-ink)]">
              And on the other side of the world, I saw Western experts paying $20,000 for ghostwriters who flattened their voice into competence. Getting manuscripts that were structurally sound and emotionally dead.
            </blockquote>
            <p>So I built something else.</p>
            <p>The Author's Forge is the distillation of everything I have learned: from HarperCollins, from Liverpool Hope, from running publishing imprints at international book fairs, from dissecting narrative structure across books and film.</p>
            <p>It is built in India — with its cost efficiency, its literary soul, its deep tradition of storytelling — and offered to the world.</p>
            <p className="font-display text-xl text-[var(--ia-ink)]">Because expertise has no passport. And every serious expert deserves a book that carries their name with pride.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TIMELINE = [
  {
    era: "2003 — 2005",
    title: "The Training",
    subtitle: "Liverpool Hope University",
    body: "Postgraduate Certificate, Literary Studies & Film. Master's-level training in literary analysis, narrative theory, and film studies. The foundation for the editorial philosophy: that structure is architecture, that voice is identity, and that every cut is a creative decision.",
    quote: "Film taught me what books cannot — that the silence between sentences matters as much as the sentences themselves."
  },
  {
    era: "2005 — 2016",
    title: "The Career",
    subtitle: "Publishing & Marketing",
    body: "A decade building digital marketing strategy, web presence, and online sales channels for UK and Indian clients. Then four years fine-tuning global publishing strategy with the group president. Walking the floors of Frankfurt and Beijing book fairs, negotiating rights, watching manuscripts become global properties."
  },
  {
    era: "2017 — Present",
    title: "The Practice",
    subtitle: "James Hemingway & Vyas Imprints — Co-Founder & Publishing Director",
    body: "Built an independent publishing imprint from investment to sustained pipeline. Published quality nonfiction across business, cultural, and spiritual domains. And in the middle of it all, my own book — A to B: How To Move From Adversity To Breakthrough With Powerful Storytelling — published by HarperCollins India. The proof that I have been on your side of the desk."
  }
];

const PedigreeSection = () => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <FolioNumber n={3} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          The Path <em className="font-display-italic text-[var(--ia-forest)]">Here</em>
        </h2>
        <p className="mt-6 text-lg text-[var(--ia-ink-mute)] italic">
          HarperCollins author. Publishing director. Film-trained editor. Marketing strategist.
        </p>
      </div>
      <div className="space-y-16">
        {TIMELINE.map((item, i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              <div className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-bronze-deep)] uppercase mb-2">
                {item.era}
              </div>
              <h3 className="font-display text-3xl leading-tight">{item.title}</h3>
              <p className="mt-2 text-sm italic text-[var(--ia-ink-mute)]">{item.subtitle}</p>
            </div>
            <div className="lg:col-span-9 lg:pl-12 lg:border-l hairline">
              <p className="text-lg leading-relaxed text-[var(--ia-ink-soft)]">{item.body}</p>
              {item.quote && (
                <blockquote className="mt-6 border-l-2 border-[var(--ia-bronze)] pl-6 italic text-[var(--ia-ink)]">
                  {item.quote}
                </blockquote>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-20 pt-10 border-t hairline text-center">
        <p className="font-display text-2xl text-[var(--ia-ink)]">
          I am not one thing. I am the intersection of all of them. That is what the Forge is built from.
        </p>
      </div>
    </div>
  </section>
);

const BELIEFS = [
  { title: "A book is not a product. It is a filter.", body: "The right book filters out price shoppers and filters in the clients who have already decided you are the expert before the call begins." },
  { title: "Most business books are unreadable.", body: "Because they are written by marketers, not editors. They are structurally sound and emotionally dead." },
  { title: "AI is a furnace, not a blacksmith.", body: "It makes the fire hotter. It does not know when the steel is ready. That judgment belongs to human editors." },
  { title: "Every expert deserves a real book.", body: "Not a vanity project. A book that carries their weight, their voice, their scars." },
  { title: "Publishing is a sacred responsibility.", body: "The written word has carried the deepest teachings for centuries. A book is a living transmission." }
];

const PhilosophySection = () => (
  <section className="bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] border-b border-[var(--ia-forest-deep)]">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="font-display tabular text-[11px] tracking-[0.4em] text-[var(--ia-bronze)] uppercase">№ 04</span>
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          What I <em className="font-display-italic text-[var(--ia-bronze)]">Believe</em>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {BELIEFS.map((b, i) => (
          <article key={i} className="bg-[var(--ia-ink)] p-10 sm:p-12 flex flex-col">
            <div className="font-display tabular text-[64px] leading-none text-[var(--ia-bronze)] opacity-40">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-6 font-display text-2xl leading-tight">{b.title}</h3>
            <p className="mt-6 text-white/70 leading-relaxed flex-1">{b.body}</p>
          </article>
        ))}
        <article className="bg-[var(--ia-forest-deep)] p-10 sm:p-12 flex flex-col justify-center items-center text-center">
          <p className="font-display-italic text-2xl text-[var(--ia-ivory-warm)] leading-relaxed">
            I believe in India. In its literary tradition. In its thriving community of thinkers and builders. I believe expertise has no passport.
          </p>
          <p className="mt-8 text-sm tracking-[0.3em] uppercase text-[var(--ia-bronze)]">
            — Hersh Bhardwaj, The Author's Forge
          </p>
        </article>
      </div>
    </div>
  </section>
);

const MethodSection = () => (
  <section className="bg-[var(--ia-ivory)] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-b hairline">
    <div className="max-w-[1480px] mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <FolioNumber n={5} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          How I Work <em className="font-display-italic text-[var(--ia-forest)]">With Authors</em>
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--ia-rule)] border hairline">
        <div className="bg-[var(--ia-ivory-warm)] p-10 sm:p-14">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-7 h-7 border border-[var(--ia-forest)] rounded-full flex items-center justify-center text-[var(--ia-forest)]">✓</span>
            <Eyebrow className="text-[var(--ia-forest)]">What I Do</Eyebrow>
          </div>
          <ul className="space-y-6 text-[var(--ia-ink-soft)] leading-relaxed">
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I read every manuscript paragraph aloud. If I do not hear your voice, I rewrite it.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I ask the follow-up question that makes you uncomfortable.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I treat your expertise like architecture. I find the load-bearing sentence in every chapter.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I calibrate your Voice DNA from your existing content and enforce it across 60,000 words.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I fact-check every claim. I verify every attribution.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I stay up late reading your draft because I cannot sleep until I know whether Chapter 7 earns its place.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-bronze)] mt-1">✦</span><span>I celebrate when you cry reading your own manuscript. Because that means we found the truth.</span></li>
          </ul>
        </div>
        <div className="bg-[var(--ia-ivory-warm)] p-10 sm:p-14">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-7 h-7 border hairline rounded-full flex items-center justify-center text-[var(--ia-ink-mute)]">✕</span>
            <Eyebrow>What I Do Not Do</Eyebrow>
          </div>
          <ul className="space-y-6 text-[var(--ia-ink-soft)] leading-relaxed">
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not write your book for you. Ghostwriting is not editing.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not accept generic prose. If a sentence could appear in any other business book, it dies.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not chase trends. We are building a book that outlives algorithms.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not flatter. If your book idea is weak, I will tell you.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not compromise on the Three Gates. Structural. Voice. Authority.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not delegate the reading of applications. I read every word myself.</span></li>
            <li className="flex gap-4"><span className="text-[var(--ia-ink-mute)] mt-1">✦</span><span>I do not forget what it felt like to be an unpublished expert sitting on a book idea.</span></li>
          </ul>
          <div className="mt-10 pt-6 border-t hairline grid grid-cols-3 gap-4">
            <div className="text-center p-4 border hairline"><div className="font-display text-xs tracking-[0.3em] uppercase text-[var(--ia-bronze-deep)]">Gate One</div><div className="mt-2 font-display text-lg">Structural</div></div>
            <div className="text-center p-4 border hairline"><div className="font-display text-xs tracking-[0.3em] uppercase text-[var(--ia-bronze-deep)]">Gate Two</div><div className="mt-2 font-display text-lg">Voice</div></div>
            <div className="text-center p-4 border hairline"><div className="font-display text-xs tracking-[0.3em] uppercase text-[var(--ia-bronze-deep)]">Gate Three</div><div className="mt-2 font-display text-lg">Authority</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const InvitationSection = ({ onApply }) => (
  <section className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
      <div className="max-w-3xl mx-auto text-center">
        <FolioNumber n={6} />
        <h2 className="mt-6 font-display text-[44px] sm:text-[64px] leading-[0.95]">
          A Personal <em className="font-display-italic text-[var(--ia-forest)]">Invitation</em>
        </h2>
        <div className="mt-10 w-20 mx-auto"><RuleOrnament /></div>
      </div>
      <div className="max-w-3xl mx-auto mt-16 space-y-6 text-lg leading-relaxed text-[var(--ia-ink-soft)]">
        <p>If you have read this far, you are probably sitting on a book idea.</p>
        <p>Maybe it is a methodology you have developed over years of client work. Maybe it is a spiritual journey that transformed your life. Maybe it is a perspective on your industry that no one else is articulating.</p>
        <p>Whatever it is, it deserves more than a blog post. It deserves a book — a permanent, physical, undeniable artifact of your expertise.</p>
      </div>
      <blockquote className="max-w-3xl mx-auto mt-12 border-l-2 border-[var(--ia-forest)] pl-6 py-2 italic text-[var(--ia-ink)] text-xl leading-relaxed">
        I cannot write it for you. But I can build the forge that turns your raw material into steel. I can ask the questions that surface what matters. I can find the architecture that holds your thinking upright.
      </blockquote>
      <div className="max-w-3xl mx-auto mt-12 text-lg leading-relaxed text-[var(--ia-ink-soft)]">
        <p>The Forge is not for everyone. It is for 10-12 serious experts per cohort who are done with "someday" and ready to publish.</p>
        <p className="mt-4">If that is you, apply. I will read your application personally.</p>
      </div>
      <div className="max-w-3xl mx-auto mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onApply} className="btn-primary px-14 py-5">
          <span>Apply for the Electric Cohort</span>
          <Feather size={14} strokeWidth={1.3} />
        </button>
        <Link to="/" className="btn-ghost px-10 py-5">
          <span>Join the Quiet List</span>
          <ArrowRight size={14} strokeWidth={1.3} />
        </Link>
      </div>
      <div className="max-w-3xl mx-auto mt-6 text-center eyebrow">
        Either way, write the book. The world needs your expertise.
      </div>
    </div>
  </section>
);

const MentorFooter = () => (
  <footer className="bg-[var(--ia-ivory)] py-16 px-6 sm:px-12 lg:px-20 border-t hairline">
    <div className="max-w-[1480px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm text-[var(--ia-ink-mute)]">
      <div>
        <div className="font-display text-2xl text-[var(--ia-ink)]">Hersh Bhardwaj</div>
        <div className="mt-2 italic">HarperCollins Author · Publishing Editor · Founder, The Author's Forge</div>
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
        <Eyebrow>The Author's Forge</Eyebrow>
        <div className="mt-3 italic">Made in India for the World</div>
        <div className="mt-2 font-display tabular text-2xl text-[var(--ia-ink)]">MMXXIV</div>
      </div>
    </div>
  </footer>
);

export default function MentorPage() {
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

  const scrollToApply = () => {
    window.location.href = "/#apply";
  };

  return (
    <div className="min-h-screen bg-[var(--ia-ivory)] text-[var(--ia-ink)] selection:bg-[var(--ia-forest)] selection:text-[var(--ia-ivory-warm)] overflow-x-hidden">
      <div className="reveal-in"><PortraitSection onApply={scrollToApply} /></div>
      <div className="reveal-in"><OriginSection /></div>
      <div className="reveal-in"><PedigreeSection /></div>
      <div className="reveal-in"><PhilosophySection /></div>
      <div className="reveal-in"><MethodSection /></div>
      <div className="reveal-in"><InvitationSection onApply={scrollToApply} /></div>
      <MentorFooter />
    </div>
  );
}
