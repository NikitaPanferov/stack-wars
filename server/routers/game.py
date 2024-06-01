from typing import Annotated

from fastapi import APIRouter, Depends

from conf.config import Settings
from core.game_manager.manager import GameManager, game_manager
from schemas import InitArmiesDTO
from schemas.action import Action, ActionType
from schemas.game_state import GameState
from schemas.next_stepDTO import NextStepDTO
from schemas.strategy_type import StrategyType
from schemas.unitDTO import UnitDTO, UnitType

router = APIRouter(prefix="/game")


@router.post("/start")
async def start_game(
    armies: InitArmiesDTO, gm: Annotated[GameManager, Depends(game_manager)]
) -> GameState:
    return GameState(game_state=gm.start_new_game(armies))


@router.get("/next_step")
async def next_step(gm: Annotated[GameManager, Depends(game_manager)]) -> NextStepDTO:
    return gm.next_step()


@router.get("/undo")
async def undo(gm: Annotated[GameManager, Depends(game_manager)]) -> GameState:
    return GameState(game_state=gm.undo())


@router.get("/redo")
async def redo(gm: Annotated[GameManager, Depends(game_manager)]) -> GameState:
    return GameState(game_state=gm.redo())


@router.get("/change_strategy")
async def change_strategy(strategy: StrategyType, gm: Annotated[GameManager, Depends(game_manager)]) -> GameState:
    return GameState(game_state=gm.change_strategy(strategy))
