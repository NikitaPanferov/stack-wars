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

router = APIRouter(prefix='/game')


@router.post('/start')
async def start_game(armies: InitArmiesDTO, gm: Annotated[GameManager, Depends(game_manager)]) -> GameState:
    return gm.start_new_game(armies)


@router.get('/next_step')
async def next_step() -> NextStepDTO:
    return NextStepDTO(
        actions=[Action(type=ActionType.attack, object=0, subject=5, value=40)],
        game_state=GameState(
            alliance=[[UnitDTO(id=i, type=UnitType.archer, **Settings().forces.alliance.archer.dict()) for i in range(5)]],
            horde=[[UnitDTO(id=i, type=UnitType.archer, **Settings().forces.horde.archer.dict()) for i in range(5, 10)]]
        )
    )


@router.get('/undo')
async def undo() -> GameState:
    return GameState(
        alliance=[[UnitDTO(id=i, type=UnitType.archer, **Settings().forces.alliance.archer.dict()) for i in range(5)]],
        horde=[[UnitDTO(id=i, type=UnitType.archer, **Settings().forces.horde.archer.dict()) for i in range(5, 10)]]
    )


@router.get('/redo')
async def redo() -> GameState:
    return GameState(
        alliance=[[UnitDTO(id=0, type=UnitType.archer, **Settings().forces.alliance.archer.dict())]],
        horde=[[UnitDTO(id=1, type=UnitType.archer, **Settings().forces.horde.archer.dict())]]
    )


@router.get('/change_strategy')
async def change_strategy(strategy: StrategyType) -> GameState:
    return GameState(
        alliance=[[UnitDTO(id=0, type=UnitType.archer, **Settings().forces.alliance.paladin.dict())]],
        horde=[[UnitDTO(id=1, type=UnitType.archer, **Settings().forces.horde.paladin.dict())]]
    )
