from core.units.interfaces import Unit, Healable, Ability


class Wizard(Unit, Healable, Ability):
    range: int

    def __init__(self, ability_range: int, hp: int, damage: int, defence: int, dodge: int, cost: int):
        self.range = ability_range
        super().__init__(hp, damage, defence, dodge, cost)

    def heal(self, hp: int):
        self.hp += hp

    def ability(self):
        pass
