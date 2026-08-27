from pathlib import Path
import json
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).parent
DATA_FILE = BASE_DIR / "data.json"

app = FastAPI(title="Apex League API")


class LeagueState(BaseModel):
    teams: list[dict] = []
    fixtures: list[dict] = []


def read_state() -> LeagueState:
    if not DATA_FILE.exists():
        return LeagueState()
    try:
        return LeagueState.model_validate_json(DATA_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return LeagueState()


def write_state(state: LeagueState) -> None:
    DATA_FILE.write_text(state.model_dump_json(indent=2), encoding="utf-8")


@app.get("/api/state", response_model=LeagueState)
def get_state() -> LeagueState:
    return read_state()


@app.put("/api/state", response_model=LeagueState)
def update_state(state: LeagueState) -> LeagueState:
    write_state(state)
    return state


@app.get("/")
def index() -> FileResponse:
    return FileResponse(BASE_DIR / "index.html")


app.mount("/", StaticFiles(directory=BASE_DIR), name="static")
