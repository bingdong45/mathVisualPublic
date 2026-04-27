import asyncio
import glob
import os
import re
import subprocess
from datetime import datetime

import anthropic
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session

from auth import get_current_user
from claude_service import generate_manim_code
from database import SessionLocal, get_db
from models import AnimationRequest, AnimationStatus, User

router = APIRouter(prefix="/api/animations", tags=["animations"])

MEDIA_DIR = "/app/media"
RENDERS_DIR = "/app/renders"


# --- Schemas ---


class AnimationRequestCreate(BaseModel):
    prompt: str

    @field_validator("prompt")
    @classmethod
    def prompt_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("prompt must not be blank")
        return v.strip()


class AnimationRequestResponse(BaseModel):
    id: int
    prompt: str
    status: AnimationStatus
    manim_code: str | None
    video_url: str | None
    error_message: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Manim rendering ---


def _extract_scene_class(code: str) -> str:
    """Return the Scene subclass name. The system prompt enforces 'MathScene',
    but fall back to regex scan in case Claude deviated."""
    if "class MathScene" in code:
        return "MathScene"
    match = re.search(r"class\s+(\w+)\s*\(.*?Scene.*?\)", code)
    if not match:
        raise ValueError("Generated code contains no Scene subclass")
    return match.group(1)


def _render_manim(animation_id: int, code: str) -> str:
    """Write code to disk, run Manim, return the served video URL."""
    script_name = f"anim_{animation_id}"
    work_dir = os.path.join(RENDERS_DIR, str(animation_id))
    os.makedirs(work_dir, exist_ok=True)

    script_path = os.path.join(work_dir, f"{script_name}.py")
    with open(script_path, "w") as f:
        f.write(code)

    class_name = _extract_scene_class(code)

    result = subprocess.run(
        [
            "manim", "render",
            "-ql",                    # low quality — fastest render
            "--disable_caching",
            "--media_dir", MEDIA_DIR,
            script_path,
            class_name,
        ],
        capture_output=True,
        text=True,
        timeout=180,
    )

    if result.returncode != 0:
        raise RuntimeError(
            f"Manim exited with code {result.returncode}:\n{result.stderr[-2000:]}"
        )

    # Manim outputs to <media_dir>/videos/<script_name>/<quality>/<ClassName>.mp4
    pattern = os.path.join(MEDIA_DIR, "videos", script_name, "**", f"{class_name}.mp4")
    matches = glob.glob(pattern, recursive=True)
    if not matches:
        # Fallback: find any mp4 under the script's video dir
        matches = glob.glob(
            os.path.join(MEDIA_DIR, "videos", script_name, "**", "*.mp4"),
            recursive=True,
        )
    if not matches:
        raise RuntimeError("Rendered video file not found after Manim completed")

    video_abs = matches[0]
    # Return a URL path relative to the backend's /media mount
    video_url = "/media/" + os.path.relpath(video_abs, MEDIA_DIR)
    return video_url


# --- Background task ---


async def _process_animation(animation_id: int) -> None:
    """Called in the background: generate code, render video, update DB."""
    db: Session = SessionLocal()
    try:
        record = db.get(AnimationRequest, animation_id)
        record.status = AnimationStatus.PROCESSING
        db.commit()

        code = await generate_manim_code(record.prompt)
        record.manim_code = code
        db.commit()

        video_url = await asyncio.to_thread(_render_manim, animation_id, code)
        record.video_url = video_url
        record.status = AnimationStatus.COMPLETED
        db.commit()

    except Exception as exc:
        db.rollback()
        record = db.get(AnimationRequest, animation_id)
        record.status = AnimationStatus.FAILED
        record.error_message = str(exc)[:1000]
        db.commit()
    finally:
        db.close()


# --- Routes ---


@router.post(
    "",
    response_model=AnimationRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_animation_request(
    body: AnimationRequestCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create an animation job. Returns immediately; processing happens in background."""
    record = AnimationRequest(
        user_id=current_user.id,
        prompt=body.prompt,
        status=AnimationStatus.PENDING,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    background_tasks.add_task(_process_animation, record.id)
    return record


@router.get("/{animation_id}", response_model=AnimationRequestResponse)
def get_animation(
    animation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.get(AnimationRequest, animation_id)
    if not record or record.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Animation not found")
    return record


@router.get("", response_model=list[AnimationRequestResponse])
def list_animations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(AnimationRequest)
        .filter(AnimationRequest.user_id == current_user.id)
        .order_by(AnimationRequest.created_at.desc())
        .all()
    )
