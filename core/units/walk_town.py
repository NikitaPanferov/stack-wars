from uuid import uuid4
import random

from core.units.interfaces.unit import Unit


class WalkTown:
    def __init__(self, hp, atk, shield, evasion, price):
        self.identifier = uuid4().hex
        self.health_points = hp
        self.attack_power = atk
        self.shield_value = shield
        self.evasion_rate = evasion
        self.cost_value = price

    def receive_damage(self, damage):
        if random.random() * 100 <= self.evasion_rate:
            return 0
        reduced_damage = damage - self.shield_value
        reduced_damage = reduced_damage if reduced_damage > 0 else 0
        self.health_points -= reduced_damage
        return reduced_damage

    def set_health(self, hp):
        self.health_points = hp

    def get_attack(self):
        return self.attack_power


class WalkTownAdapter(Unit):
    def __init__(self, walk_town_unit: WalkTown):
        self.id = uuid4().hex
        self.hp = walk_town_unit.health_points
        self.damage = walk_town_unit.attack_power
        self.defence = walk_town_unit.shield_value
        self.dodge = walk_town_unit.evasion_rate
        self.cost = walk_town_unit.cost_value
        self._walk_town_unit = walk_town_unit
        
    def _init_stats(self, hp: int, damage: int, defence: int, dodge: int, cost: int, *args, **kwargs):
        return super()._init_stats(hp, damage, defence, dodge, cost, *args, **kwargs)

    def set_hp(self, hp: int):
        self._walk_town_unit.set_health(hp)
        self.hp = self._walk_town_unit.health_points

    def get_damage(self) -> int:
        return self._walk_town_unit.get_attack()

    def take_damage(self, damage: int) -> int:
        taken_damage = self._walk_town_unit.receive_damage(damage)
        self.hp = self._walk_town_unit.health_points
        return taken_damage
