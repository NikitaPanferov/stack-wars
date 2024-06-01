from __future__ import annotations  # для правильной работы аннотаций

import random
from abc import ABC
from uuid import uuid4


class Unit(ABC):
    id: str
    hp: int
    damage: int
    defence: int
    dodge: int
    cost: int

    def __init__(self, unit=None, *args, **kwargs):
        self.id = uuid4().hex
        if unit:
            self.hp = unit.hp
            self.damage = unit.damage
            self.defence = unit.defence
            self.dodge = unit.dodge
            self.cost = unit.cost
        else:
            self._init_stats(*args, **kwargs)

    def _init_stats(self, hp: int, damage: int, defence: int, dodge: int, cost: int, *args, **kwargs):
        self.hp = hp
        self.damage = damage
        self.defence = defence
        self.dodge = dodge
        self.cost = cost

    def set_hp(self, hp: int):
        self.hp = hp

    def get_damage(self) -> int:
        return self.damage

    def take_damage(self, damage: int) -> int:
        if random.random() * 100 <= self.dodge:
            return 0
        defenced_damage = damage - self.defence
        self.hp -= defenced_damage
        return defenced_damage
