from core.commands.command import Command
from core.units.interfaces import Unit


class Attack(Command):
    def __init__(self, attaker: Unit, deffender: Unit):
        self.attaker = attaker
        self.deffender = deffender

    def do(self):
        damage = self.attaker.get_damage()
        self.taken_damage = self.deffender.take_damage(damage)

    def undo(self):
        self.deffender.set_hp(self.deffender.hp + self.taken_damage)
