from core.units.interfaces import Unit, Healable, Cloneable


class LightSwordsman(Unit, Healable, Cloneable):
    heal_percent: int

    def __init__(self, heal_percent: int, hp: int, damage: int, defence: int, dodge: int, cost: int):
        self.heal_percent = heal_percent
        super().__init__(hp, damage, defence, dodge, cost)

    def heal(self) -> int:
        healed = int(self.hp / 100 * self.heal_percent)
        self.hp += healed
        return healed

    def clone(self) -> Unit:
        return LightSwordsman(self.hp, self.damage, self.defence, self.dodge, self.cost)