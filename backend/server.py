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

from pdf_generator import generate_curriculum_brief_pdf, generate_specimen_chapter_pdf, _ensure_fonts


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

DATABASE_URL = os.environ['DATABASE_URL']

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
    return {
        "id": lead.id,
        "source": lead.source,
        "download_url": LEAD_DOWNLOAD_MAP.get(lead.source),
        "message": "Thank you — your copy is on its way." if LEAD_DOWNLOAD_MAP.get(lead.source) else
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
