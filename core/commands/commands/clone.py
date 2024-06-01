from core.army.army import Army
from core.commands.command import Command
from core.units.interfaces.cloneable import Cloneable
from core.units.wizard import Wizard


class Clone(Command):
    def __init__(self, unit: Wizard, army: Army, target: Cloneable):
        self.unit = unit
        self.army = army
        self.target = target
        self.i, self.j = self.army.find_unit(self.unit)

    def do(self):
        self.army.add_unit(self.target.clone(), self.i, self.j)

    def undo(self):
        self.army.units[self.i].pop(self.j)
