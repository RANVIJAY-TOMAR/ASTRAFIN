from __future__ import annotations

import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader, select_autoescape

from app.routes.chat import router as chat_router


app = FastAPI(title="AstraFin Loan Advisor", version="0.1.0")


origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")

templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

jinja_env = Environment(
    loader=FileSystemLoader(templates_dir),
    autoescape=select_autoescape(["html", "xml"]),
)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request) -> HTMLResponse:
    template = jinja_env.get_template("index.html")
    html = template.render(request=request)
    return HTMLResponse(html)


app.include_router(chat_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

