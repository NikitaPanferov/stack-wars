from abc import ABC, abstractmethod


class Healable(ABC):
    @abstractmethod
    def heal(self, hp: int):
        raise NotImplementedError()
