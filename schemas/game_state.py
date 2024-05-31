from typing import List, Any

from pydantic import BaseModel

from core.units.interfaces import Unit
from schemas.unitDTO import UnitDTO


class GameState(BaseModel):
    alliance: List[List[UnitDTO]]
    horde: List[List[UnitDTO]]

    @classmethod
    def from_class(cls, alliance: List[List[Unit]], horde: List[List[Unit]]):
        return cls(
            alliance=[[UnitDTO.from_orm(unit) for unit in units] for units in alliance],
            horde=[[UnitDTO.from_orm(unit) for unit in units] for units in horde],
        )
