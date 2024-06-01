from abc import ABC, abstractmethod

from core.units.interfaces.unit import Unit


class Ability(ABC):
    @abstractmethod
    def ability(self, unit: Unit):
        raise NotImplementedError()
