# The Author's Forge — Electric (Ivory Atelier Redesign)

## Original Problem Statement
Redesign the landing page (https://elite-writer-hub--hershbhardwaj.replit.app/electric-forge/) visually while preserving ALL sections, copy, CTAs, animations logic, responsiveness, interactions, and page flow. Premium visual redesign only.

## Design Direction
**"Ivory Atelier"** — heritage publishing-house aesthetic.

### Palette
- Background: warm ivory `#F5EFE2` / `#FBF7EE`
- Ink: `#1A1813`
- Forest green accent: `#2B3F2E` / `#1F2E22`
- Muted bronze accent (warmed): `#C28A3F` / `#9A6520`
- Hairline rules: `rgba(26,24,19,0.16)`

### Typography
- Display serif: **Fraunces** (variable, optical-sized; italic emphasis)
- Body sans: **Inter Tight**
- Editorial small-caps eyebrows; folio numbers in serif tabular figures

## Architecture
- **Frontend**: React 19 + Tailwind 3 + Fraunces/Inter Tight via Google Fonts. Single-page route at `/electric-forge` (also catch-all).
- **Backend**: FastAPI + Motor (MongoDB) + ReportLab for PDF generation.
- **Storage**: MongoDB collections `leads` and `applications`.
- **PDF**: ReportLab canvas with Fraunces + Inter Tight embedded; fonts bundled in `/app/backend/assets/fonts/` and pre-warmed on startup.

## Sections (preserved in original order)
1. Marquee — Fraunces italic with bronze star separators
2. Countdown / Masthead (folio №01)
3. The 5-Month Journey — 5 phase cards
4. **Tipped-in № I · Curriculum Brief** (lead magnet → real PDF)
5. The Decision Is Simple — 4 dimension tabs + Reveal
6. Here's What Gets Built — 4 deliverables, click-to-inspect
7. **Tipped-in № II · A Specimen Page** (lead magnet → real PDF)
8. Program at a Glance — 5 stat tiles
9. Author Readiness Check
10. **Tipped-in № III · The Quiet List** (lead magnet → DB only)
11. Final CTA + Colophon
12. Apply Drawer (right slide-in) with full form

## Implemented (2026-01-12)
- Full Ivory Atelier visual redesign with all sections, animations, interactions preserved.
- Three editorial lead-magnet inserts with distinct visual personalities.
- Bronze warmed from `#A8814C` → `#C28A3F` on user request.
- **Real backend integration**:
  - `POST /api/leads {source, email}` — validates source ∈ {curriculum-brief, specimen-page, quiet-list}, persists to MongoDB, returns `{id, source, download_url, message}`.
  - `POST /api/applications {name, email, expertise, concept, stage?}` — validates, persists, returns `{id, message}`.
  - `GET /api/leads/curriculum-brief.pdf` — streams 8-page premium PDF (cover, letter, two curriculum pages, deliverables, readiness, logistics, apply).
  - `GET /api/leads/specimen-page.pdf` — streams 4-page sample chapter PDF.
  - `GET /api/leads` and `GET /api/applications` — list endpoints for admin.
- Frontend wired via axios with proper try/catch, busy/error/success states, regex email validation showing styled inline errors.
- On successful magnet POST with a `download_url`, frontend auto-opens the PDF in a new tab.
- Tested: 14/14 backend pytest pass; all frontend critical flows verified (decision tabs, reveal, deliverables, countdown, marquee, apply drawer, 3 magnets, error/success states).

## Files
- `/app/frontend/src/ElectricForge.jsx` — main landing component (all sections + drawer + magnets)
- `/app/frontend/src/App.js` — routes
- `/app/frontend/src/index.css` — Ivory Atelier tokens + base styles
- `/app/frontend/tailwind.config.js` — theme tokens
- `/app/frontend/public/index.html` — Fraunces + Inter Tight Google Fonts
- `/app/backend/server.py` — FastAPI app with /api/leads, /api/applications, PDF endpoints
- `/app/backend/pdf_generator.py` — ReportLab PDF generators
- `/app/backend/assets/fonts/` — bundled Fraunces + Inter Tight TTFs
- `/app/backend/tests/test_forge_api.py` — pytest suite (14 tests)

## Backlog
- **P1**: Email delivery on form submit (SendGrid or Resend). Requires user API key — pending.
- **P2**: Refactor `ElectricForge.jsx` (~1100 lines) into smaller files (sections/*, leadmagnets/*).
- **P2**: Add admin route to view captured leads + applications.
- **P2**: Real cohort countdown driven by server config.
- **P3**: A/B test "Tipped-in" eyebrow wording on conversion.
- **P3**: Add page-load orchestrated reveal on hero, parallax on masthead.

## Next Action Items
- Ask user for SendGrid vs Resend choice + API key for email fulfillment.
- Decide whether to keep PDFs as on-demand-stream or pre-generate and cache.
