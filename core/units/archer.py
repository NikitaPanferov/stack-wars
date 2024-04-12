from core.units.interfaces import Unit, Ability, Healable, Cloneable


class Archer(Unit, Ability, Healable, Cloneable):
    range: int

    def __init__(self, ability_range: int, hp: int, damage: int, defence: int, dodge: int, cost: int):
        self.range = ability_range
        super().__init__(hp, damage, defence, dodge, cost)

    def ability(self):
        pass

    def heal(self, hp: int):
        self.hp += hp

    def clone(self) -> Unit:
        return Archer(self.range, self.hp, self.damage, self.defence, self.dodge, self.cost)
