from core.units.interfaces import Unit, Healable, Cloneable


class LightSwordsman(Unit, Healable, Cloneable):
    def heal(self, hp: int):
        self.hp += hp

    def clone(self) -> Unit:
        return LightSwordsman(self.hp, self.damage, self.defence, self.dodge, self.cost)
