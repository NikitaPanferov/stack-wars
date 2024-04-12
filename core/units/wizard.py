from core.units.interfaces import Unit, Healable, Ability


class Wizard(Unit, Healable, Ability):
    range: int
    heal_percent: int

    def __init__(self, heal_percent: int, ability_range: int, hp: int, damage: int, defence: int, dodge: int,
                 cost: int):
        self.heal_percent = heal_percent
        self.range = ability_range
        super().__init__(hp, damage, defence, dodge, cost)

    def heal(self) -> int:
        healed = int(self.hp / 100 * self.heal_percent)
        self.hp += healed
        return healed

    def ability(self):
        pass
