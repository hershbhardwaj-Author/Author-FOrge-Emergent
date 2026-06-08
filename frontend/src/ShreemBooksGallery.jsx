import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────────
   Shreem Books — The Imprint Gallery
   A standalone page for the complete catalogue.
   ─────────────────────────────────────────────────────────────────────────── */

const Eyebrow = ({ children, className = "" }) => (
  <span className={`eyebrow ${className}`}>{children}</span>
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
   Book Data — 14 titles published under James Hemingway / Shreem Books
   Populate cover, isbn, and link fields as assets become available.
   ─────────────────────────────────────────────────────────────────────────── */

const SHREEM_CATALOGUE = [
  { id: 1,  title: "[Book Title 1]",  author: "[Author Name]",  cover: "/shreem/1.jpg", isbn: null, link: null, desc: "" },
  { id: 2,  title: "[Book Title 2]",  author: "[Author Name]",  cover: "/shreem/2.jpg", isbn: null, link: null, desc: "" },
  { id: 3,  title: "[Book Title 3]",  author: "[Author Name]",  cover: "/shreem/3.jpg", isbn: null, link: null, desc: "" },
  { id: 4,  title: "[Book Title 4]",  author: "[Author Name]",  cover: "/shreem/4.jpg", isbn: null, link: null, desc: "" },
  { id: 5,  title: "[Book Title 5]",  author: "[Author Name]",  cover: "/shreem/5.jpg", isbn: null, link: null, desc: "" },
  { id: 6,  title: "[Book Title 6]",  author: "[Author Name]",  cover: "/shreem/6.jpg", isbn: null, link: null, desc: "" },
  { id: 7,  title: "[Book Title 7]",  author: "[Author Name]",  cover: "/shreem/7.jpg", isbn: null, link: null, desc: "" },
  { id: 8,  title: "[Book Title 8]",  author: "[Author Name]",  cover: "/shreem/8.jpg", isbn: null, link: null, desc: "" },
  { id: 9,  title: "[Book Title 9]",  author: "[Author Name]",  cover: "/shreem/9.jpg", isbn: null, link: null, desc: "" },
  { id: 10, title: "[Book Title 10]", author: "[Author Name]", cover: "/shreem/10.jpg", isbn: null, link: null, desc: "" },
  { id: 11, title: "[Book Title 11]", author: "[Author Name]", cover: "/shreem/11.jpg", isbn: null, link: null, desc: "" },
  { id: 12, title: "[Book Title 12]", author: "[Author Name]", cover: "/shreem/12.jpg", isbn: null, link: null, desc: "" },
  { id: 13, title: "[Book Title 13]", author: "[Author Name]", cover: "/shreem/13.jpg", isbn: null, link: null, desc: "" },
  { id: 14, title: "[Book Title 14]", author: "[Author Name]", cover: "/shreem/14.jpg", isbn: null, link: null, desc: "" },
];

/* ──────────────────────────────────────────────────────────────────────────────
   Header / Masthead
   ─────────────────────────────────────────────────────────────────────────── */

const GalleryHeader = () => (
  <header className="bg-[var(--ia-ivory-warm)] border-b hairline">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-[var(--ia-ink-mute)] hover:text-[var(--ia-ink)] transition-colors duration-300 group"
        >
          <ArrowLeft size={14} strokeWidth={1.3} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="eyebrow">Back to The Forge</span>
        </Link>
        <div className="hidden sm:flex items-center gap-3">
          <BookOpen size={14} strokeWidth={1.3} className="text-[var(--ia-bronze)]" />
          <span className="eyebrow text-[var(--ia-bronze-deep)]">The Imprint</span>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-end pb-12 border-b hairline">
        <div>
          <FolioNumber n={1} />
          <h1 className="mt-6 font-display text-[56px] sm:text-[88px] leading-[0.92]">
            Shreem<br />
            <em className="font-display-italic text-[var(--ia-forest)]">Books.</em>
          </h1>
        </div>
        <div className="lg:pl-12 lg:border-l hairline">
          <p className="text-lg sm:text-xl text-[var(--ia-ink-soft)] italic leading-relaxed max-w-xl">
            A dedicated nonfiction imprint curated by James Hemingway. 
            Fourteen titles. One standard: books that earn their place on a shelf.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[var(--ia-ink-mute)]">
            <span className="font-display tabular text-[11px] tracking-[0.4em] uppercase">Folio</span>
            <span className="leader-dots" />
            <span className="font-display tabular text-[11px] tracking-[0.4em] uppercase">Catalogue · 14 pp</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Book Grid
   ─────────────────────────────────────────────────────────────────────────── */

const BookGrid = () => (
  <section className="bg-[var(--ia-ivory)] py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
    <div className="max-w-[1480px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[var(--ia-rule)] border hairline">
        {SHREEM_CATALOGUE.map((book, i) => (
          <article 
            key={book.id} 
            className="group bg-[var(--ia-ivory-warm)] flex flex-col hover:bg-[var(--ia-ivory-deep)] transition-colors duration-500"
          >
            {/* Cover Image */}
            <div className="aspect-[2/3] bg-[var(--ia-ink)] relative overflow-hidden">
              <img 
                src={book.cover} 
                alt={`${book.title} by ${book.author}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.querySelector('.fallback').style.display = 'flex';
                }}
              />
              <div 
                className="fallback hidden absolute inset-0 flex-col items-center justify-center p-6 text-center"
                style={{ display: 'none' }}
              >
                <div className="font-display text-2xl sm:text-3xl text-[var(--ia-ivory-warm)] leading-tight mb-3">
                  {book.title}
                </div>
                <div className="w-10 h-px bg-[var(--ia-bronze)]" />
                <div className="mt-3 text-sm italic text-white/60">{book.author}</div>
              </div>

              {/* Hover overlay with link */}
              {book.link && (
                <a 
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-[var(--ia-ink)]/0 group-hover:bg-[var(--ia-ink)]/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 bg-[var(--ia-ivory-warm)] px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-display text-[var(--ia-ink)]">
                    View <ArrowUpRight size={12} strokeWidth={1.3} />
                  </span>
                </a>
              )}
            </div>

            {/* Meta */}
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl leading-tight group-hover:text-[var(--ia-forest)] transition-colors duration-300">
                    {book.title}
                  </h3>
                  <div className="mt-2 eyebrow text-[var(--ia-ink-mute)]">by {book.author}</div>
                </div>
                <span className="font-display tabular text-[11px] tracking-[0.3em] text-[var(--ia-ink-mute)] shrink-0 mt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {book.desc && (
                <p className="mt-4 text-sm text-[var(--ia-ink-soft)] leading-relaxed flex-1">
                  {book.desc}
                </p>
              )}

              {book.isbn && (
                <div className="mt-4 pt-4 border-t hairline">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--ia-ink-mute)] font-mono">
                    ISBN {book.isbn}
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Colophon / Footer
   ─────────────────────────────────────────────────────────────────────────── */

const GalleryFooter = () => (
  <footer className="bg-[var(--ia-ink)] text-[var(--ia-ivory-warm)] border-t border-[var(--ia-forest-deep)]">
    <div className="max-w-[1480px] mx-auto px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
        <div>
          <div className="w-16 mb-8">
            <RuleOrnament glyph="✦" />
          </div>
          <h2 className="font-display text-[36px] sm:text-[56px] leading-[0.95]">
            A book is not a<br />
            <em className="font-display-italic text-[var(--ia-bronze)]">product.</em>
          </h2>
          <p className="mt-6 text-lg text-white/70 italic max-w-lg leading-relaxed">
            It is a permanent record of someone's thinking. Shreem Books exists only 
            to publish work that deserves permanence.
          </p>
        </div>
        <div className="lg:text-right">
          <div className="inline-block text-left lg:text-right">
            <div className="font-display text-2xl text-[var(--ia-ivory-warm)]">Shreem Books</div>
            <div className="mt-2 text-sm italic text-white/50">A nonfiction imprint of The Author's Forge</div>
            <div className="mt-6 flex flex-col gap-2 text-sm text-white/50">
              <span>Curated by James Hemingway</span>
              <span>Distributed via IngramSpark & Amazon KDP</span>
            </div>
            <div className="mt-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-3 h-[52px] px-10 bg-[var(--ia-ivory-warm)] text-[var(--ia-ink)] text-[11px] tracking-[0.28em] uppercase hover:bg-[var(--ia-bronze)] hover:text-[var(--ia-ivory-warm)] transition-colors duration-300"
              >
                <span>Return to The Forge</span>
                <ArrowUpRight size={13} strokeWidth={1.3} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <span className="font-display tabular tracking-[0.3em] uppercase">Shreem Books · MMXXIV</span>
        <span>Fourteen titles. One standard.</span>
      </div>
    </div>
  </footer>
);

/* ──────────────────────────────────────────────────────────────────────────────
   Root
   ─────────────────────────────────────────────────────────────────────────── */

export default function ShreemBooksGallery() {
  // Reveal-on-scroll
  const observerRef = useRef(null);
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-in");
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.08 }
    );
    els.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current && observerRef.current.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ia-ivory)] text-[var(--ia-ink)] selection:bg-[var(--ia-forest)] selection:text-[var(--ia-ivory-warm)] overflow-x-hidden">
      <GalleryHeader />
      <div className="reveal-in"><BookGrid /></div>
      <div className="reveal-in"><GalleryFooter /></div>
    </div>
  );
}
