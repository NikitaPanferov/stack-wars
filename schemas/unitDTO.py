from enum import Enum
from typing import Optional

from pydantic import BaseModel

from conf.config import Unit


class UnitType(str, Enum):
    archer = 'archer'
    heavy_swordsman = 'heavy_swordsman'
    light_swordsman = 'light_swordsman'
    paladin = 'paladin'
    wizard = 'wizard'


class UnitDTO(BaseModel, Unit):
    id: int
    type: UnitType

    class Config:
        use_enum_values = True
