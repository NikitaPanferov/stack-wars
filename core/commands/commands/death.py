from core.army.army import Army
from core.commands.command import Command
from core.units.interfaces import Unit
from schemas.on_death_callback import OnDeathCallback, UndoDeath


class Death(Command):
    def __init__(self, unit: Unit, army: Army, on_death: OnDeathCallback, undo_death: UndoDeath):
        self.unit = unit
        self.army = army

        self.old_i = self.old_j = self.j = self.i = None

        self.on_death = on_death
        self.undo_death = undo_death

    def do(self):
        self.i, self.j = self.army.delete_unit(self.unit)
        self.old_i, self.old_j = self.on_death(self.i, self.j, self.army)

    def undo(self):
        self.undo_death(self.i, self.j, self.old_i, self.old_j, self.army)
        self.army.add_unit(self.unit, self.i, self.j)
