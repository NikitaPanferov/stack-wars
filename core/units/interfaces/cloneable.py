from abc import ABC, abstractmethod

from core.units.interfaces.unit import Unit


class Cloneable(ABC):
    @abstractmethod
    def clone(self) -> Unit:
        raise NotImplementedError()
