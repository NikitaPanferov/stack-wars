from typing import List

from core.units.interfaces import Unit


class Army:
    units: List[Unit]

    def __init__(self, units: List[Unit]):
        self.units = units

    def __len__(self):
        return len(self.units)
