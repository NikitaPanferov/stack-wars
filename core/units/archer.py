from __future__ import annotations

from core.units.interfaces import Unit, Ability, Healable, Cloneable
from misc.lazy import lazy


@lazy
class Archer(Unit, Ability, Healable, Cloneable):
    range: int
    heal_percent: int
    ranged_damage: int

    def __init__(self, unit: Archer | None = None, *args, **kwargs):
        super().__init__(unit, *args, **kwargs)

        if unit:
            self.range = unit.range
            self.heal_percent = unit.heal_percent
            self.ranged_damage: unit.ranged_damage
        else:
            self._init_stats(*args, **kwargs)

    def _init_stats(self, range: int, heal_percent: int, ranged_damage: int, *args, **kwargs):
        self.range = range
        self.heal_percent = heal_percent
        self.ranged_damage = ranged_damage

    def ability(self):
        pass

    def heal(self) -> int:
        healed = int(self.hp / 100 * self.heal_percent)
        self.hp += healed
        return healed

    def clone(self) -> Unit:
        return Archer(self)
