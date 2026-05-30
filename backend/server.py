from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import asyncpg
import os
import logging
from io import BytesIO
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Literal, Optional
import uuid
from datetime import datetime, timezone
import resend

from pdf_generator import generate_curriculum_brief_pdf, generate_specimen_chapter_pdf, _ensure_fonts


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

DATABASE_URL = os.environ['DATABASE_URL']
resend.api_key = os.environ.get('RESEND_API_KEY', '')

RESEND_FROM  = "The Author's Forge <onboarding@resend.dev>"
ADMIN_EMAIL  = os.environ.get("ADMIN_EMAIL", "hersh.bhardwaj@gmail.com")


def _send_admin_application_email(application):
    """Notify admin of a new application. Non-fatal on failure."""
    try:
        resend.Emails.send({
            "from": RESEND_FROM,
            "to": [ADMIN_EMAIL],
            "subject": f"New Application — {application.name} | The Author's Forge",
            "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9f6f0;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;padding:40px 24px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#faf8f3;border:1px solid #d4c9b0;">
        <tr>
          <td style="background:#1a1a1a;padding:24px 40px;">
            <p style="margin:0;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#c9a96e;">
              The Author's Forge · New Application
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 20px;">
            <h1 style="margin:0 0 6px;font-size:26px;font-weight:400;">
              {application.name}
            </h1>
            <p style="margin:0;font-size:13px;color:#8a7a5a;">{application.email}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #d4c9b0;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 0 0;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#8a7a5a;width:160px;vertical-align:top;">Expertise</td>
                <td style="padding:16px 0 0;font-size:14px;color:#1a1a1a;vertical-align:top;">{application.expertise}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#8a7a5a;vertical-align:top;">Stage</td>
                <td style="padding:14px 0 0;font-size:14px;color:#1a1a1a;vertical-align:top;">{application.stage or "—"}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#8a7a5a;vertical-align:top;">Concept</td>
                <td style="padding:14px 0 0;font-size:14px;line-height:1.7;color:#1a1a1a;vertical-align:top;">{application.concept}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#8a7a5a;vertical-align:top;">Submitted</td>
                <td style="padding:14px 0 0;font-size:14px;color:#1a1a1a;vertical-align:top;">{application.created_at}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid #d4c9b0;">
            <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#a09070;">
              Review within 48 hours · Five-month residency · By application only
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""",
        })
        logger.info(f"Admin notified of new application from {application.email}")
    except Exception as e:
        logger.warning(f"Admin notification email failed: {e}")


def _send_curriculum_brief_email(to_email: str, pdf_url: str):
    """Send curriculum brief autoresponder via Resend. Non-fatal on failure."""
    try:
        resend.Emails.send({
            "from": RESEND_FROM,
            "to": [to_email],
            "subject": "Your Curriculum Brief — The Author's Forge · Electric",
            "html": f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f6f0;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;padding:48px 24px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#faf8f3;border:1px solid #d4c9b0;">
        <tr>
          <td style="padding:40px 48px 32px;border-bottom:1px solid #d4c9b0;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#8a7a5a;">The Author's Forge · Electric</p>
            <h1 style="margin:0;font-size:32px;font-weight:400;line-height:1.05;">The <em>Curriculum Brief</em></h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#3a3530;">
              Thank you for your interest in The Author's Forge. Your six-page editorial breakdown of the five-month residency is ready.
            </p>
            <p style="margin:0 0 32px;font-size:16px;line-height:1.7;color:#3a3530;">
              Click the button below to open your copy of the brief. It walks through every phase of the residency, the editorial standard we hold, and exactly what you'll walk away with after five months.
            </p>
            <table cellpadding="0" cellspacing="0"><tr><td>
              <a href="{pdf_url}"
                 style="display:inline-block;padding:14px 32px;background:#2d4a35;color:#faf8f3;text-decoration:none;font-family:Georgia,serif;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;">
                Open the Brief
              </a>
            </td></tr></table>
            <p style="margin:32px 0 0;font-size:13px;line-height:1.7;color:#8a7a5a;font-style:italic;">
              If the button doesn't open, copy this link into your browser:<br>
              <span style="color:#2d4a35;">{pdf_url}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 48px;border-top:1px solid #d4c9b0;">
            <p style="margin:0;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#a09070;">
              Five-month residency · By application only · 10–12 authors per cohort
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
""",
        })
        logger.info(f"Curriculum brief email sent to {to_email}")
    except Exception as e:
        logger.warning(f"Resend email failed for {to_email}: {e}")

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ── Database pool ──────────────────────────────────────────────────────────────

_pool: asyncpg.Pool = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(DATABASE_URL)
        await _init_schema(_pool)
    return _pool


async def _init_schema(pool: asyncpg.Pool):
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS leads (
                id TEXT PRIMARY KEY,
                source TEXT NOT NULL,
                email TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                expertise TEXT NOT NULL,
                concept TEXT NOT NULL,
                stage TEXT DEFAULT '',
                created_at TEXT NOT NULL
            )
        """)


# ── Models ────────────────────────────────────────────────────────────────────

LeadSource = Literal["curriculum-brief", "specimen-page", "quiet-list"]


class LeadIn(BaseModel):
    source: LeadSource
    email: EmailStr


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    source: LeadSource
    email: EmailStr
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ApplicationIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    expertise: str = Field(min_length=1, max_length=120)
    concept: str = Field(min_length=10, max_length=4000)
    stage: Optional[str] = Field(default="", max_length=120)


class Application(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    expertise: str
    concept: str
    stage: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ── Lead endpoint ────────────────────────────────────────────────────────────

LEAD_DOWNLOAD_MAP = {
    "curriculum-brief": "/api/leads/curriculum-brief.pdf",
    "specimen-page":    "/api/leads/specimen-page.pdf",
    "quiet-list":       None,
}


@api_router.post("/leads")
async def create_lead(payload: LeadIn):
    lead = Lead(source=payload.source, email=payload.email)
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO leads (id, source, email, created_at) VALUES ($1, $2, $3, $4)",
            lead.id, lead.source, lead.email, lead.created_at
        )
    download_url = LEAD_DOWNLOAD_MAP.get(lead.source)
    if lead.source == "curriculum-brief" and download_url and resend.api_key:
        base_url = os.environ.get("REPLIT_DEV_DOMAIN", "")
        if base_url:
            pdf_url = f"https://{base_url}{download_url}"
        else:
            pdf_url = download_url
        _send_curriculum_brief_email(lead.email, pdf_url)
    return {
        "id": lead.id,
        "source": lead.source,
        "download_url": download_url,
        "message": "Thank you — your copy is on its way." if download_url else
                   "You're on the Quiet List. First dispatch arrives next quarter.",
    }


@api_router.get("/leads")
async def list_leads(limit: int = 200):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, source, email, created_at FROM leads ORDER BY created_at DESC LIMIT $1",
            limit
        )
    return [dict(r) for r in rows]


# ── Application endpoint ─────────────────────────────────────────────────────

@api_router.post("/applications")
async def create_application(payload: ApplicationIn):
    application = Application(**payload.model_dump())
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO applications (id, name, email, expertise, concept, stage, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            application.id, application.name, application.email,
            application.expertise, application.concept, application.stage or "",
            application.created_at
        )
    if resend.api_key:
        _send_admin_application_email(application)
    return {
        "id": application.id,
        "message": "Application received. Our editorial board reviews every submission within 48 hours.",
    }


@api_router.get("/applications")
async def list_applications(limit: int = 200):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, name, email, expertise, concept, stage, created_at FROM applications ORDER BY created_at DESC LIMIT $1",
            limit
        )
    return [dict(r) for r in rows]


# ── PDF asset endpoints ──────────────────────────────────────────────────────

@api_router.get("/leads/curriculum-brief.pdf")
async def curriculum_brief_pdf():
    pdf_bytes = generate_curriculum_brief_pdf()
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'inline; filename="The-Curriculum-Brief.pdf"',
            "Cache-Control": "public, max-age=3600",
        },
    )


@api_router.get("/leads/specimen-page.pdf")
async def specimen_page_pdf():
    pdf_bytes = generate_specimen_chapter_pdf()
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'inline; filename="A-Specimen-Page.pdf"',
            "Cache-Control": "public, max-age=3600",
        },
    )


# ── Health & legacy ──────────────────────────────────────────────────────────

@api_router.get("/")
async def root():
    return {"message": "The Author's Forge API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    try:
        _ensure_fonts()
    except Exception as e:
        logger.warning(f"Font pre-warm failed: {e}")
    try:
        await get_pool()
        logger.info("Database pool initialized")
    except Exception as e:
        logger.warning(f"DB pool init failed: {e}")


@app.on_event("shutdown")
async def shutdown():
    global _pool
    if _pool:
        await _pool.close()
