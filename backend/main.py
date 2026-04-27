import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from animations import router as animations_router
from auth import router as auth_router
from database import engine
from models import Base

MEDIA_DIR = "/app/media"
os.makedirs(MEDIA_DIR, exist_ok=True)  # must exist before StaticFiles is mounted


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Math Animator API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(animations_router)
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")


@app.get("/health")
def health_check():
    return {"status": "ok"}
