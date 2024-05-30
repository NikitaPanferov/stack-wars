from abc import ABC, abstractmethod

from core.army.army import Army
from schemas.unitDTO import UnitDTO

class AbcStrategy(ABC):
    @abstractmethod
    def handle_death(dead: UnitDTO, army: Army):
        pass
    
    @abstractmethod
    def rebuild_armies(alliance: Army, horde: Army):
        pass