from abc import ABC, abstractmethod


class Command(ABC):
    @abstractmethod
    def do(self):
        pass

    @abstractmethod
    def undo(self):
        pass
