from __future__ import annotations
from core.units.interfaces import Unit, Healable
from misc.lazy import lazy


@lazy
class HeavySwordsman(Unit, Healable):
    heal_percent: int

    def __init__(self, unit: HeavySwordsman | None = None, *args, **kwargs):
        super().__init__(unit, *args, **kwargs)

        if unit:
            self.heal_percent = unit.heal_percent
        else:
            self._init_stats(*args, **kwargs)

    def _init_stats(self, heal_percent: int, *args, **kwargs):
        self.heal_percent = heal_percent

    def heal(self) -> int:
        healed = int(self.hp / 100 * self.heal_percent)
        self.hp += healed
        return healed
