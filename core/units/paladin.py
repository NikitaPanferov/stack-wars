from core.units.interfaces import Unit, Ability, Cloneable, Healable


class Paladin(Unit, Ability, Cloneable, Healable):
    range: int
    heal_percent: int

    def __init__(self, heal_percent: int, ability_range: int, hp: int, damage: int, defence: int, dodge: int, cost: int):
        self.heal_percent = heal_percent
        self.range = ability_range
        super().__init__(hp, damage, defence, dodge, cost)

    def ability(self):
        pass

    def heal(self) -> int:
        healed = int(self.hp / 100 * self.heal_percent)
        self.hp += healed
        return healed

    def clone(self) -> Unit:
        return Paladin(self.range, self.hp, self.damage, self.defence, self.dodge, self.cost)
