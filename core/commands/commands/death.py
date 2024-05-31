from core.army.army import Army
from core.commands.command import Command
from core.units.interfaces import Unit


class Death(Command):
    def __init__(self, unit: Unit, army: Army):
        self.unit = unit
        self.army = army
        self.i = None
        self.j = None

    def do(self):
        self.i, self.j = self.army.delete_unit(self.unit)

    def undo(self):
        self.army.add_unit(self.unit, self.i, self.j)
