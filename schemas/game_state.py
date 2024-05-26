from typing import List

from pydantic import BaseModel

from schemas.unitDTO import UnitDTO


class GameState(BaseModel):
    alliance: List[List[UnitDTO]]
    horde: List[List[UnitDTO]]
