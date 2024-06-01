from enum import Enum

from pydantic import BaseModel

from conf.config import Unit as ConfigUnit
from core.units import Archer, HeavySwordsman, LightSwordsman, Paladin, Wizard, WalkTownAdapter
from core.units.interfaces import Unit


class UnitType(str, Enum):
    archer = 'archer'
    heavy_swordsman = 'heavy_swordsman'
    light_swordsman = 'light_swordsman'
    paladin = 'paladin'
    wizard = 'wizard'
    walk_town = 'walk_town'


ClassName_UnitType = {
            Archer.__name__: UnitType.archer,
            HeavySwordsman.__name__: UnitType.heavy_swordsman,
            LightSwordsman.__name__: UnitType.light_swordsman,
            Wizard.__name__: UnitType.wizard,
            Paladin.__name__: UnitType.paladin,
            WalkTownAdapter.__name__: UnitType.walk_town
        }


class UnitDTO(BaseModel, ConfigUnit):
    id: str
    type: UnitType

    class Config:
        use_enum_values = True

    @classmethod
    def from_class(cls, unit: Unit):
        return cls(
            type=ClassName_UnitType.get(unit.__class__.__name__),
            hp=unit.hp,
            damage=unit.damage,
            defence=unit.defence,
            dodge=unit.dodge,
            cost=unit.cost,
            id=unit.id
        )
