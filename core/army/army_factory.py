from abc import ABC, abstractmethod

from core.units import Archer, HeavySwordsman, LightSwordsman, Paladin, Wizard


class ArmyFactory(ABC):
    @abstractmethod
    def archer(self) -> Archer:
        raise NotImplementedError()

    @abstractmethod
    def heavy_swordsman(self) -> HeavySwordsman:
        raise NotImplementedError()

    @abstractmethod
    def light_swordsman(self) -> LightSwordsman:
        raise NotImplementedError()

    @abstractmethod
    def paladin(self) -> Paladin:
        raise NotImplementedError()

    @abstractmethod
    def wizard(self) -> Wizard:
        raise NotImplementedError()
