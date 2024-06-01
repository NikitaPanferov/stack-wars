from core.army.army import Army
from core.commands.command import Command
from core.units.archer import Archer
from core.units.interfaces.unit import Unit


class Arrow(Command):
    def __init__(self, unit: Archer, army: Army, target: Unit):
        self.unit = unit
        self.army = army
        self.damage = self.unit.ranged_damage
        self.target = target

    def do(self):
        self.unit.ability(self.target)

    def undo(self):
        self.target.set_hp(self.target.hp + self.damage)
