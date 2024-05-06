import json
from abc import ABC

import yaml
from pydantic import BaseModel

from misc.singleton import SingletonBaseModelMeta


class Unit(ABC):
    hp: int
    damage: int
    defence: int
    dodge: int
    cost: int


class RangeMixin(ABC):
    range: int


class HealPercentMixin(ABC):
    heal_percent: int


class Archer(Unit, RangeMixin, HealPercentMixin, BaseModel):
    pass


class HeavySwordsman(Unit, HealPercentMixin, BaseModel):
    pass


class LightSwordsman(Unit, HealPercentMixin, BaseModel):
    pass


class Paladin(Unit, HealPercentMixin, RangeMixin, BaseModel):
    pass


class Wizard(Unit, RangeMixin, HealPercentMixin, BaseModel):
    pass


class Army(BaseModel):
    archer: Archer
    heavy_swordsman: HeavySwordsman
    light_swordsman: LightSwordsman
    paladin: Paladin
    wizard: Wizard


class Forces(BaseModel):
    alliance: Army
    horde: Army


class Settings(BaseModel, metaclass=SingletonBaseModelMeta):
    forces: Forces

    @classmethod
    def load_from_yaml(cls, file_path):
        """ Загружает и применяет конфигурацию из YAML файла. """
        with open(file_path, 'r') as file:
            data = yaml.safe_load(file)
            cls(**data)

    @classmethod
    def load_from_json(cls, json_str):
        """ Загружает и применяет конфигурацию из JSON строки. """
        data = json.loads(json_str)
        cls(**data)


Settings.load_from_yaml('config.yaml')

print(Settings())

Settings.load_from_yaml('config.yaml')

print(Settings())




