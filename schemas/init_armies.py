from typing import List

from pydantic import BaseModel

from schemas.unitDTO import UnitType


class InitArmiesDTO(BaseModel):
    horde: List[UnitType]
    alliance: List[UnitType]

    class Config:
        use_enum_values = True
