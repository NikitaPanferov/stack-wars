from typing import List

from pydantic import BaseModel

from schemas.action import Action
from schemas.game_state import GameState


class NextStepDTO(BaseModel):
    actions: List[Action]
    game_state: GameState