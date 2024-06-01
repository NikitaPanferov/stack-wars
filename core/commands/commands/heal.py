from core.army.army import Army
from core.commands.command import Command
from core.units.interfaces.healable import Healable
from core.units.paladin import Paladin


class Heal(Command):
    def __init__(self, target: Healable):
        self.target = target
        self.heal_value = self.target.heal()

    def do(self):
        self.target.set_hp(self.target.hp + self.heal_value)

    def undo(self):
        self.target.set_hp(self.target.hp - self.heal_value)
