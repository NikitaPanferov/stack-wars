from abc import ABC, abstractmethod


class Ability(ABC):
    @abstractmethod
    def ability(self):
        raise NotImplementedError()
