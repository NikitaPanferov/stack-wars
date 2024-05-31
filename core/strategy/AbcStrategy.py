from abc import ABC, abstractmethod

from core.army.army import Army


class AbcStrategy(ABC):
    @abstractmethod
    def handle_death(self, dead_i: int, dead_j: int, army: Army) -> (int, int):
        pass
    
    @abstractmethod
    def rebuild_armies(self, alliance: Army, horde: Army):
        pass

    @abstractmethod
    def handle_undo(self, from_i: int, from_j: int, to_i: int, to_j: int, army: Army):
        pass

    @staticmethod
    def move_units_to_first_row(army: Army) -> Army:
        army.units = [[unit for unit in row] for row in army.units]
        return army
