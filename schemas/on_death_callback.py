from typing import Protocol

from core.army.army import Army


class OnDeathCallback(Protocol):
    def __call__(self, dead_i: int, dead_j: int, army: Army) -> (int, int):
        pass


class UndoDeath(Protocol):
    def __call__(self, from_i: int, from_j:int, to_i: int, to_j: int, army: Army):
        pass