from __future__ import annotations  # для правильной работы аннотаций

import random
from abc import ABC


class Unit(ABC):
    hp: int
    damage: int
    defence: int
    dodge: int
    cost: int

    def __init__(self, hp: int, damage: int, defence: int, dodge: int, cost: int):
        self.hp = hp
        self.damage = damage
        self.defence = defence
        self.dodge = dodge
        self.cost = cost

    def attack(self, unit: Unit) -> int:
        return unit.take_damage(self.damage)

    def take_damage(self, damage: int) -> int:
        if random.random() * 100 >= self.dodge:
            return 0
        defenced_damage = damage - self.defence
        self.hp -= defenced_damage
        return defenced_damage
