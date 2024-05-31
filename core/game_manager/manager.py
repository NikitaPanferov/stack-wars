from typing import AsyncGenerator

from core.army.army import Army
from core.army.army_builder import ArmyBuilder
from core.army.army_factory import ArmyFactory
from misc.singleton import SingletonMeta
from schemas import InitArmiesDTO
from schemas.game_state import GameState


class GameManager(metaclass=SingletonMeta):
    def __init__(self):
        self.alliance: Army | None = None
        self.horde: Army | None = None

    def start_new_game(self, armies: InitArmiesDTO) -> GameState:
        alliance_factory = ArmyFactory.factory("alliance")
        horde_factory = ArmyFactory.factory("horde")

        alliance_builder = ArmyBuilder(alliance_factory)
        horde_builder = ArmyBuilder(horde_factory)

        self.alliance = Army(alliance_builder, armies.alliance)
        self.horde = Army(horde_builder, armies.horde)

        return GameState.from_class(alliance=self.alliance.units, horde=self.horde.units)


async def game_manager() -> AsyncGenerator[GameManager, None]:
    try:
        yield GameManager()
    finally:
        pass
