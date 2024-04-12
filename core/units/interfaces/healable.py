from abc import ABC, abstractmethod


class Healable(ABC):
    @abstractmethod
    def heal(self) -> int:
        raise NotImplementedError()
