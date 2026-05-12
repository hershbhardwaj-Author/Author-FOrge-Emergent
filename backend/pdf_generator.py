"""
Curriculum Brief PDF generator — The Author's Forge (Electric Cohort).
Produces a multi-page, premium-typeset PDF mirroring the Ivory Atelier aesthetic.
"""
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pathlib import Path
import urllib.request
import os

# ── Colour tokens (Ivory Atelier) ─────────────────────────────────────────────
IVORY      = HexColor("#F5EFE2")
IVORY_WARM = HexColor("#FBF7EE")
IVORY_DEEP = HexColor("#EFE7D4")
INK        = HexColor("#1A1813")
INK_SOFT   = HexColor("#3A3528")
INK_MUTE   = HexColor("#5A523F")
FOREST     = HexColor("#2B3F2E")
FOREST_DP  = HexColor("#1F2E22")
BRONZE     = HexColor("#C28A3F")
BRONZE_DP  = HexColor("#9A6520")
RULE       = Color(26/255, 24/255, 19/255, 0.18)
RULE_SOFT  = Color(26/255, 24/255, 19/255, 0.10)

# ── Font registration (Fraunces + Inter Tight bundled with the app) ──────────
BUNDLED_FONTS = Path(__file__).parent / "assets" / "fonts"
FONTS_DIR = Path("/tmp/forge_fonts")
FONTS_DIR.mkdir(parents=True, exist_ok=True)

FONT_URLS = {
    "Fraunces-Regular":
        "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf",
    "Fraunces-Italic":
        "https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces-Italic%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf",
    "InterTight-Regular":
        "https://raw.githubusercontent.com/google/fonts/main/ofl/intertight/InterTight%5Bwght%5D.ttf",
}

_FONTS_READY = False
_FONT_NAMES = None


def _resolve_font(name: str) -> Path:
    """Prefer bundled font in /assets/fonts; fall back to downloading to /tmp."""
    bundled = BUNDLED_FONTS / f"{name}.ttf"
    if bundled.exists() and bundled.stat().st_size > 10000:
        return bundled
    cached = FONTS_DIR / f"{name}.ttf"
    if not cached.exists() or cached.stat().st_size < 10000:
        url = FONT_URLS.get(name)
        if url:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=15) as r:
                    cached.write_bytes(r.read())
            except Exception as e:
                print(f"[pdf] Font download failed {name}: {e}")
    return cached


def _ensure_fonts():
    """Register Fraunces + Inter Tight. Return tuple of registered font names."""
    global _FONTS_READY, _FONT_NAMES
    if _FONTS_READY and _FONT_NAMES:
        return _FONT_NAMES
    try:
        pdfmetrics.registerFont(TTFont("Fraunces", str(_resolve_font("Fraunces-Regular"))))
        pdfmetrics.registerFont(TTFont("Fraunces-Italic", str(_resolve_font("Fraunces-Italic"))))
        pdfmetrics.registerFont(TTFont("InterTight", str(_resolve_font("InterTight-Regular"))))
        pdfmetrics.registerFont(TTFont("Fraunces-Display", str(_resolve_font("Fraunces-Regular"))))
        _FONT_NAMES = ("Fraunces-Display", "Fraunces", "Fraunces-Italic", "InterTight")
        print("[pdf] Custom fonts registered")
    except Exception as e:
        print(f"[pdf] Falling back to built-in fonts: {e}")
        _FONT_NAMES = ("Times-Bold", "Times-Roman", "Times-Italic", "Helvetica")
    _FONTS_READY = True
    return _FONT_NAMES


PAGE_W, PAGE_H = LETTER
MARGIN_X = 0.9 * inch
MARGIN_Y = 0.85 * inch


def _draw_page_chrome(c: canvas.Canvas, page_no: int, total: int, section_label: str = ""):
    """Background, hairline frame, running head, folio number, footer rule."""
    # Background ivory
    c.setFillColor(IVORY)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Outer hairline frame
    c.setStrokeColor(RULE)
    c.setLineWidth(0.5)
    c.rect(0.45 * inch, 0.45 * inch, PAGE_W - 0.9 * inch, PAGE_H - 0.9 * inch, fill=0, stroke=1)

    # Running head: left = brand, right = section
    c.setFont("Helvetica", 7.5)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, PAGE_H - 0.62 * inch, "THE AUTHOR'S FORGE  ·  ELECTRIC COHORT")
    if section_label:
        c.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 0.62 * inch, section_label.upper())

    # Header hairline
    c.setStrokeColor(RULE)
    c.line(MARGIN_X, PAGE_H - 0.72 * inch, PAGE_W - MARGIN_X, PAGE_H - 0.72 * inch)

    # Footer hairline
    c.line(MARGIN_X, 0.75 * inch, PAGE_W - MARGIN_X, 0.75 * inch)

    # Folio (page number with ornament)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, 0.58 * inch, "THE CURRICULUM BRIEF")
    c.setFillColor(BRONZE_DP)
    c.drawCentredString(PAGE_W / 2, 0.58 * inch, "✦")
    c.setFillColor(INK_MUTE)
    c.drawRightString(PAGE_W - MARGIN_X, 0.58 * inch, f"PAGE {page_no:02d} / {total:02d}")


def _wrap(text, font, size, max_w, c):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) > max_w:
            if cur:
                lines.append(cur)
            cur = w
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines


def _eyebrow(c, x, y, text, color=INK_MUTE):
    c.setFont("Helvetica", 7.5)
    c.setFillColor(color)
    # tracked uppercase
    txt = "  ".join(list(text.upper()))
    c.drawString(x, y, txt)


def _display(c, x, y, text, size=42, italic=False, color=INK, font_d=None, font_i=None):
    font = font_i if italic else font_d
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, text)


def _body(c, x, y, text, font_b, size=10.5, color=INK_SOFT, leading=15.5, max_w=None):
    """Paragraph with simple wrap. Returns y-cursor after drawing."""
    max_w = max_w or (PAGE_W - 2 * MARGIN_X)
    c.setFont(font_b, size)
    c.setFillColor(color)
    for line in _wrap(text, font_b, size, max_w, c):
        c.drawString(x, y, line)
        y -= leading
    return y


def _italic_body(c, x, y, text, font_i, size=11, color=INK_SOFT, leading=16, max_w=None):
    max_w = max_w or (PAGE_W - 2 * MARGIN_X)
    c.setFont(font_i, size)
    c.setFillColor(color)
    for line in _wrap(text, font_i, size, max_w, c):
        c.drawString(x, y, line)
        y -= leading
    return y


def _rule(c, y, color=RULE, width=0.5, margin=None):
    margin = margin or MARGIN_X
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(margin, y, PAGE_W - margin, y)


def _ornament_rule(c, y, glyph="✦"):
    _rule(c, y)
    c.setFillColor(IVORY)
    cx = PAGE_W / 2
    c.rect(cx - 12, y - 5, 24, 10, fill=1, stroke=0)
    c.setFont("Helvetica", 9)
    c.setFillColor(BRONZE_DP)
    c.drawCentredString(cx, y - 3, glyph)


# ────────────────────────────────────────────────────────────────────────────
# Content blocks
# ────────────────────────────────────────────────────────────────────────────

PHASES = [
    {
        "n": "01",
        "title": "The Architecture",
        "tag": "Month 1 · Weeks 1–4",
        "intent":
            "Blueprint the foundation. We tear down your ideas and rebuild them into an unshakable structure.",
        "weekly": [
            ("Week 01", "Positioning intensive: identify the singular argument your book must make."),
            ("Week 02", "Audience and stakes mapping. Define who the book is for — and who it isn't."),
            ("Week 03", "Skeletal outline. Chapter-by-chapter spine, with the through-line marked in red."),
            ("Week 04", "Editorial defense. You present the structure to the cohort and your lead editor."),
        ],
        "outcome": "An approved book architecture: thesis, structure, audience, and stakes.",
    },
    {
        "n": "02",
        "title": "The Writing Forge",
        "tag": "Months 2 & 3 · Weeks 5–12",
        "intent":
            "This is where the fire gets hot. Intensive, relentless writing with direct editorial feedback.",
        "weekly": [
            ("Weeks 05–06", "Chapters 1 & 2 drafted. Voice calibration with your lead editor."),
            ("Weeks 07–08", "Mid-book chapters. Tempo correction. Cohort peer-reads."),
            ("Weeks 09–10", "Late chapters and pivotal arguments. Structural editing pass."),
            ("Weeks 11–12", "Closing chapters. Manuscript-wide line edit begins."),
        ],
        "outcome": "A complete first manuscript — 70,000 to 90,000 words, edited.",
    },
    {
        "n": "03",
        "title": "Publishing Mechanics",
        "tag": "Month 4 · Weeks 13–16",
        "intent":
            "We handle the technical execution. Typesetting, cover design, legal framework.",
        "weekly": [
            ("Week 13", "Typesetting and interior design. Print specimen approved."),
            ("Week 14", "Cover design — three editorial concepts, one selected."),
            ("Week 15", "Legal: rights, permissions, ISBN, copyright registration."),
            ("Week 16", "Distribution setup: print, ebook, audiobook channels."),
        ],
        "outcome": "Press-ready book files; cover; distribution live across formats.",
    },
    {
        "n": "04",
        "title": "The Publicity Engine",
        "tag": "Month 5 · Weeks 17–20",
        "intent":
            "Launch preparation. We don't just release a book, we detonate it in your market.",
        "weekly": [
            ("Week 17", "Press list, podcast tour, and bulk-order architecture."),
            ("Week 18", "Author website, sales page, lead-magnet excerpts."),
            ("Week 19", "Pre-orders open. Endorsement campaign and media targeting."),
            ("Week 20", "Launch week. Coordinated release. Bestseller logistics."),
        ],
        "outcome": "A coordinated launch with press, distribution, and demand pre-built.",
    },
    {
        "n": "05",
        "title": "Beyond the Book",
        "tag": "Ongoing · Post-Launch",
        "intent":
            "Your book is a weapon. We teach you how to wield it to dominate your industry long-term.",
        "weekly": [
            ("Month 6", "Speaking strategy: bureaus, fee structure, and keynote design."),
            ("Month 7", "Premium offer redesign: pricing, packaging, and book-led funnels."),
            ("Month 8", "Authority compounding: citations, press, and category positioning."),
            ("Ongoing", "Annual cohort alumni reunion — invitations are permanent."),
        ],
        "outcome": "A book that compounds — into speaking, premium offers, and category authority.",
    },
]

DELIVERABLES_DETAIL = [
    ("Finished Manuscript",
     "70,000–90,000 words, structurally edited and line-edited. Delivered as a Word and PDF master file with editorial annotations preserved."),
    ("Published Book",
     "Hardcover, paperback, ebook and audiobook editions. ISBN registered. Distribution across Amazon, Ingram, Apple Books, Kobo, Spotify, and Audible."),
    ("Marketing Blueprint",
     "A 40-page launch plan: positioning brief, press list, podcast pitch, bulk-order architecture, social calendar and sales-page copy framework."),
    ("Lasting Authority",
     "A named category position with a citation asset that compounds. Author bio, speaker one-sheet, media kit, and a permanent press archive."),
]

READINESS = [
    ("01", "You hold deep expertise in a specific field",
     "The Forge is built for practitioners — operators, advisors, clinicians, and category leaders — not for first-time writers searching for a topic."),
    ("02", "You can defend twelve hours a week, for twenty weeks",
     "There is no version of this program that survives ambient effort. The cohort fills only with authors who can commit the time."),
    ("03", "You want a published book, not a self-published manuscript",
     "Every Forge book is professionally typeset, designed, distributed, and launched. We don't produce drafts; we produce books that sit on shelves."),
]

LOGISTICS = [
    ("Cohort Size",       "Strictly 10–12 authors. Applications close when full."),
    ("Cadence",           "Weekly live masterclass (90 min). Monthly 1:1 strategy call."),
    ("Duration",          "20 weeks of structured residency. Lifetime alumni access."),
    ("Format",            "Live cohort, fully remote. Recordings available within 24 hours."),
    ("Investment",        "By application. Disclosed during qualification call."),
    ("Refund Posture",    "Outcome-aligned. Full details shared during the qualification call."),
]


# ────────────────────────────────────────────────────────────────────────────
# Page renderers
# ────────────────────────────────────────────────────────────────────────────

def _page_cover(c, fonts, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, 1, total_pages, "Cover")

    y = PAGE_H - 1.7 * inch
    _eyebrow(c, MARGIN_X, y, "The Author's Forge · Electric Cohort", color=BRONZE_DP)

    y -= 0.7 * inch
    c.setFont(F_DISPLAY, 56)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "The")
    y -= 58
    c.setFont(F_ITALIC, 64)
    c.setFillColor(FOREST)
    c.drawString(MARGIN_X, y, "Curriculum")
    y -= 58
    c.setFont(F_DISPLAY, 56)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "Brief.")

    y -= 0.6 * inch
    _ornament_rule(c, y)

    y -= 0.5 * inch
    c.setFont(F_ITALIC, 14)
    c.setFillColor(INK_SOFT)
    for line in [
        "A six-page editorial breakdown of the five-month residency",
        "that turns serious experts into published authors.",
    ]:
        c.drawString(MARGIN_X, y, line)
        y -= 22

    # Colophon block at bottom
    y_bot = 1.4 * inch
    _rule(c, y_bot + 0.4 * inch, color=RULE)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, y_bot + 0.2 * inch, "PREPARED FOR")
    c.drawString(MARGIN_X + 2.4 * inch, y_bot + 0.2 * inch, "ISSUED")
    c.drawString(MARGIN_X + 4.4 * inch, y_bot + 0.2 * inch, "FORM")

    c.setFont(F_DISPLAY_R, 11)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y_bot, "Prospective Forge Author")
    c.drawString(MARGIN_X + 2.4 * inch, y_bot, datetime.now().strftime("%B %Y"))
    c.drawString(MARGIN_X + 4.4 * inch, y_bot, "PDF · 6 pages")


def _page_letter(c, fonts, page_no, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, page_no, total_pages, "Letter")

    y = PAGE_H - 1.5 * inch
    _eyebrow(c, MARGIN_X, y, "№ 01 · A Letter from the Editor", color=BRONZE_DP)

    y -= 0.5 * inch
    c.setFont(F_DISPLAY, 32)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "On why this exists.")

    y -= 0.5 * inch
    body = [
        "Most experts are best-kept secrets. Their work is excellent and their reach is local. A book is the single asset that breaks that pattern: it travels where you cannot, speaks while you sleep, and sets the terms by which strangers meet you.",
        "The Forge exists because writing a real book is too large a project to attempt by accident. Five months is not a long time, but it is long enough to architect, draft, edit, publish, and launch — provided every week is accounted for and every decision is supported by an editor who has done this before.",
        "This brief is not a sales document. It is the same curriculum we hand to every author on day one — distilled into six pages so you can decide, with full information, whether to apply.",
    ]
    for p in body:
        y = _body(c, MARGIN_X, y, p, F_BODY, size=10.8, leading=16.4, color=INK_SOFT)
        y -= 6

    y -= 0.3 * inch
    _ornament_rule(c, y)
    y -= 0.4 * inch

    c.setFont(F_ITALIC, 11)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, y, "— The Editorial Board")
    c.setFont("Helvetica", 7.5)
    c.drawString(MARGIN_X, y - 14, "THE AUTHOR'S FORGE")


def _page_curriculum(c, fonts, phases_slice, page_no, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, page_no, total_pages, "Curriculum")

    y = PAGE_H - 1.5 * inch
    _eyebrow(c, MARGIN_X, y, "№ 02 · The Five-Month Curriculum", color=BRONZE_DP)

    y -= 0.45 * inch
    c.setFont(F_DISPLAY, 30)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "The Journey, week by week.")

    y -= 0.45 * inch

    for phase in phases_slice:
        # Phase header
        if y < 2.0 * inch:
            break  # safety
        c.setFont(F_DISPLAY_R, 36)
        c.setFillColor(BRONZE_DP)
        c.drawString(MARGIN_X, y, phase["n"])

        c.setFont(F_DISPLAY, 18)
        c.setFillColor(INK)
        c.drawString(MARGIN_X + 0.85 * inch, y + 2, phase["title"])

        c.setFont("Helvetica", 8)
        c.setFillColor(INK_MUTE)
        c.drawString(MARGIN_X + 0.85 * inch, y - 14, "  ".join(list(phase["tag"].upper())))

        y -= 30
        # Italic intent
        y = _italic_body(c, MARGIN_X + 0.85 * inch, y, phase["intent"], F_ITALIC, size=10.5, color=INK_SOFT, leading=15,
                         max_w=PAGE_W - 2 * MARGIN_X - 0.85 * inch)
        y -= 6

        # Weekly milestones
        for label, text in phase["weekly"]:
            c.setFont(F_DISPLAY_R, 9)
            c.setFillColor(BRONZE_DP)
            c.drawString(MARGIN_X + 0.85 * inch, y, label)
            c.setFont(F_BODY, 9.5)
            c.setFillColor(INK_SOFT)
            for line in _wrap(text, F_BODY, 9.5, PAGE_W - 2 * MARGIN_X - 1.85 * inch, c):
                c.drawString(MARGIN_X + 1.85 * inch, y, line)
                y -= 13
            y -= 1

        # Outcome bar
        y -= 4
        c.setFillColor(IVORY_DEEP)
        c.rect(MARGIN_X + 0.85 * inch, y - 18, PAGE_W - 2 * MARGIN_X - 0.85 * inch, 22, fill=1, stroke=0)
        c.setFont("Helvetica", 7.5)
        c.setFillColor(BRONZE_DP)
        c.drawString(MARGIN_X + 0.95 * inch, y - 8, "OUTCOME")
        c.setFont(F_ITALIC, 9.5)
        c.setFillColor(INK)
        c.drawString(MARGIN_X + 1.65 * inch, y - 8, phase["outcome"])

        y -= 36
        _rule(c, y, color=RULE_SOFT)
        y -= 14


def _page_deliverables(c, fonts, page_no, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, page_no, total_pages, "Deliverables")

    y = PAGE_H - 1.5 * inch
    _eyebrow(c, MARGIN_X, y, "№ 03 · What Gets Built", color=BRONZE_DP)

    y -= 0.45 * inch
    c.setFont(F_DISPLAY, 30)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "Here is what you walk away with.")

    y -= 0.4 * inch
    c.setFont(F_ITALIC, 11)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, y, "Four deliverables, each one finished — not described, not promised.")

    y -= 0.5 * inch

    for i, (title, body) in enumerate(DELIVERABLES_DETAIL, 1):
        c.setFont(F_DISPLAY_R, 32)
        c.setFillColor(BRONZE_DP)
        c.drawString(MARGIN_X, y, f"{i:02d}")

        c.setFont(F_DISPLAY, 18)
        c.setFillColor(INK)
        c.drawString(MARGIN_X + 0.85 * inch, y + 2, title)

        ny = y - 18
        ny = _body(c, MARGIN_X + 0.85 * inch, ny, body, F_BODY, size=10.5, leading=16, color=INK_SOFT,
                   max_w=PAGE_W - 2 * MARGIN_X - 0.85 * inch)
        y = ny - 18
        _rule(c, y + 8, color=RULE_SOFT)


def _page_readiness(c, fonts, page_no, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, page_no, total_pages, "Readiness")

    y = PAGE_H - 1.5 * inch
    _eyebrow(c, MARGIN_X, y, "№ 04 · Author Readiness", color=BRONZE_DP)

    y -= 0.45 * inch
    c.setFont(F_DISPLAY, 30)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "Who this is — and isn't — for.")

    y -= 0.4 * inch
    y = _italic_body(c, MARGIN_X, y,
                     "We do not accept every applicant. The cohort is a curated set of practitioners. Three conditions must be true.",
                     F_ITALIC, size=11, color=INK_MUTE, leading=16)

    y -= 0.3 * inch

    for n, title, body in READINESS:
        c.setFont(F_DISPLAY_R, 30)
        c.setFillColor(BRONZE_DP)
        c.drawString(MARGIN_X, y, n)

        c.setFont(F_DISPLAY, 16)
        c.setFillColor(INK)
        c.drawString(MARGIN_X + 0.85 * inch, y + 2, title)

        ny = y - 18
        ny = _body(c, MARGIN_X + 0.85 * inch, ny, body, F_BODY, size=10.4, leading=15.6, color=INK_SOFT,
                   max_w=PAGE_W - 2 * MARGIN_X - 0.85 * inch)
        y = ny - 14
        _rule(c, y + 8, color=RULE_SOFT)


def _page_logistics(c, fonts, page_no, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, page_no, total_pages, "Logistics")

    y = PAGE_H - 1.5 * inch
    _eyebrow(c, MARGIN_X, y, "№ 05 · Logistics & Investment", color=BRONZE_DP)

    y -= 0.45 * inch
    c.setFont(F_DISPLAY, 30)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "Program at a glance.")

    y -= 0.55 * inch
    # Two-column table
    col1_x = MARGIN_X
    col2_x = MARGIN_X + 2.0 * inch

    for label, value in LOGISTICS:
        _rule(c, y + 16, color=RULE_SOFT)
        c.setFont("Helvetica", 8)
        c.setFillColor(BRONZE_DP)
        c.drawString(col1_x, y, label.upper())
        c.setFont(F_DISPLAY_R, 12)
        c.setFillColor(INK)
        # value may wrap
        for line in _wrap(value, F_DISPLAY_R, 12, PAGE_W - 2 * MARGIN_X - 2.0 * inch, c):
            c.drawString(col2_x, y, line)
            y -= 16
        y -= 18

    y -= 0.2 * inch
    _ornament_rule(c, y)
    y -= 0.35 * inch

    c.setFont(F_ITALIC, 11)
    c.setFillColor(INK_SOFT)
    for line in [
        "Every applicant is reviewed by the editorial board within forty-eight hours.",
        "If the timing is right, you'll be invited to a qualification call.",
    ]:
        c.drawString(MARGIN_X, y, line)
        y -= 16


def _page_apply(c, fonts, page_no, total_pages):
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts
    _draw_page_chrome(c, page_no, total_pages, "Apply")

    y = PAGE_H - 1.6 * inch
    _eyebrow(c, MARGIN_X, y, "№ 06 · The Next Step", color=BRONZE_DP)

    y -= 0.5 * inch
    c.setFont(F_DISPLAY, 38)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "You don't just write a book.")
    y -= 42
    c.setFont(F_ITALIC, 42)
    c.setFillColor(FOREST)
    c.drawString(MARGIN_X, y, "You become the kind of author")
    y -= 40
    c.setFont(F_DISPLAY, 38)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y, "the world pays attention to.")

    y -= 0.55 * inch
    _ornament_rule(c, y)
    y -= 0.5 * inch

    c.setFont(F_ITALIC, 13)
    c.setFillColor(INK_SOFT)
    for line in [
        "Apply for the next cohort at theauthorsforge.com — applications close",
        "when the cohort fills. Spots are strictly limited to 10–12 authors.",
    ]:
        c.drawString(MARGIN_X, y, line)
        y -= 20

    # Footer colophon block
    y_bot = 1.7 * inch
    _rule(c, y_bot + 0.6 * inch, color=RULE)
    c.setFont("Helvetica", 7.5)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, y_bot + 0.4 * inch, "IMPRINT")
    c.drawString(MARGIN_X + 2.4 * inch, y_bot + 0.4 * inch, "ESTABLISHED")
    c.drawString(MARGIN_X + 4.6 * inch, y_bot + 0.4 * inch, "EDITION")

    c.setFont(F_DISPLAY_R, 11)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y_bot + 0.2 * inch, "The Author's Forge")
    c.drawString(MARGIN_X + 2.4 * inch, y_bot + 0.2 * inch, "MMXXIV")
    c.drawString(MARGIN_X + 4.6 * inch, y_bot + 0.2 * inch, "Electric · Cohort I")

    c.setFont(F_ITALIC, 9)
    c.setFillColor(INK_MUTE)
    c.drawString(MARGIN_X, y_bot, "A publishing incubator for serious experts.")


# ────────────────────────────────────────────────────────────────────────────
# Public API
# ────────────────────────────────────────────────────────────────────────────

def generate_curriculum_brief_pdf() -> bytes:
    fonts = _ensure_fonts()
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts

    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    c.setTitle("The Curriculum Brief — The Author's Forge")
    c.setAuthor("The Author's Forge")
    c.setSubject("Curriculum brief for the Electric cohort")

    total = 7  # cover + letter + curriculum(2) + deliverables + readiness + logistics+apply combined? Let's plan:
    # Pages: 1 Cover · 2 Letter · 3 Curriculum (phases 1-3) · 4 Curriculum (phases 4-5) · 5 Deliverables · 6 Readiness · 7 Logistics · 8 Apply
    total = 8

    _page_cover(c, fonts, total); c.showPage()
    _page_letter(c, fonts, 2, total); c.showPage()
    _page_curriculum(c, fonts, PHASES[:3], 3, total); c.showPage()
    _page_curriculum(c, fonts, PHASES[3:], 4, total); c.showPage()
    _page_deliverables(c, fonts, 5, total); c.showPage()
    _page_readiness(c, fonts, 6, total); c.showPage()
    _page_logistics(c, fonts, 7, total); c.showPage()
    _page_apply(c, fonts, 8, total); c.showPage()

    c.save()
    return buf.getvalue()


def generate_specimen_chapter_pdf() -> bytes:
    """A four-page sample 'specimen chapter' from a hypothetical Forge author."""
    fonts = _ensure_fonts()
    F_DISPLAY, F_DISPLAY_R, F_ITALIC, F_BODY = fonts

    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    c.setTitle("Specimen Chapter — The Author's Forge")

    chapters = [
        ("Chapter I",
         "The Architecture of Authority",
         [
            "Every category has a named voice. Long before a buyer compares quotes or reads a sales page, they sort the field by who has written the book — literally. The book is not the work of the expert; it is the artefact that proves the expert exists. This is the architecture of authority, and it has not changed in two centuries.",
            "There is a small set of practitioners in every domain whose names travel without them. They are quoted by people they have never met. Their work is referenced in board rooms and at dinner tables. They are recognised, in the technical sense: the market has agreed to recognise them. The book is the contract that produces that recognition.",
            "What follows is a description of how that contract is constructed — and why it must be constructed slowly, deliberately, and to a standard that the publishing trade respects. The shortcut is the long way. The slow path is the only path that ends in authority.",
         ]),
        ("Chapter II",
         "The Standard of the Trade",
         [
            "There are three standards that matter: the editorial standard, the production standard, and the launch standard. Most independently produced books fail one of them quietly and all three of them loudly. The result is a manuscript that exists but does not work — a book on a shelf with no consequence.",
            "The editorial standard is the absence of slack. Every chapter must justify its existence; every paragraph must carry weight. The production standard is the typography, paper, and cover — the parts that signal, before reading, whether a book is to be taken seriously. The launch standard is the orchestration of attention in the days immediately before and after publication.",
            "The Forge meets all three by design, not by luck. The five-month curriculum is structured around them, and the cohort exists because no single author can hold them simultaneously without an editorial team behind them.",
         ]),
    ]

    page_no = 1
    total = len(chapters) * 2

    for title, subtitle, paras in chapters:
        # Title page of chapter
        _draw_page_chrome(c, page_no, total, "Specimen")
        y = PAGE_H - 2.0 * inch
        _eyebrow(c, MARGIN_X, y, title, color=BRONZE_DP)
        y -= 0.7 * inch
        c.setFont(F_DISPLAY, 44)
        c.setFillColor(INK)
        for line in _wrap(subtitle, F_DISPLAY, 44, PAGE_W - 2 * MARGIN_X, c):
            c.drawString(MARGIN_X, y, line)
            y -= 50
        y -= 0.4 * inch
        _ornament_rule(c, y)
        y -= 0.5 * inch
        c.setFont(F_ITALIC, 12)
        c.setFillColor(INK_MUTE)
        c.drawString(MARGIN_X, y, "From a forthcoming Forge author. Specimen pages.")
        c.showPage()
        page_no += 1

        # Body page
        _draw_page_chrome(c, page_no, total, "Specimen")
        y = PAGE_H - 1.5 * inch
        # Drop cap on first paragraph
        if paras:
            first = paras[0]
            drop, rest = first[0], first[1:]
            c.setFont(F_DISPLAY, 64)
            c.setFillColor(BRONZE_DP)
            c.drawString(MARGIN_X, y - 40, drop)
            # First paragraph indented for drop cap
            c.setFont(F_BODY, 11)
            c.setFillColor(INK_SOFT)
            indent_x = MARGIN_X + 0.55 * inch
            lines = _wrap(rest.strip(), F_BODY, 11, PAGE_W - MARGIN_X - indent_x, c)
            cy = y
            for i, line in enumerate(lines):
                if i < 3:
                    c.drawString(indent_x, cy, line)
                else:
                    c.drawString(MARGIN_X, cy, line)
                cy -= 17
            y = cy - 6
            for p in paras[1:]:
                y = _body(c, MARGIN_X, y, p, F_BODY, size=11, leading=17, color=INK_SOFT)
                y -= 8
        c.showPage()
        page_no += 1

    c.save()
    return buf.getvalue()
