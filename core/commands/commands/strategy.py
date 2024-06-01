from core.commands.command import Command
from core.strategy import AbcStrategy


class Strategy(Command):
    def __init__(self, strategy: AbcStrategy, gm):
        self.strategy = strategy
        self.gm = gm
        self.old_strategy = gm.strategy
        self.old_state = [[*gm.alliance.units], [*gm.horde.units]]
        self.strategy.rebuild_armies(gm.alliance, gm.horde)
        self.new_state = [[*gm.alliance.units], [*gm.horde.units]]
        self.gm.alliance.units, self.gm.horde.units = self.old_state


    def do(self):
        self.gm.strategy = self.strategy
        self.gm.alliance.units, self.gm.horde.units = self.new_state

    def undo(self):
        self.gm.strategy = self.old_strategy
        self.gm.alliance.units, self.gm.horde.units = self.old_state
