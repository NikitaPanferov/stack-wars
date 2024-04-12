from core.units.interfaces import Unit, Healable


class HeavySwordsman(Unit, Healable):
    def heal(self, hp: int):
        self.hp += hp
