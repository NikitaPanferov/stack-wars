
from conf.config import Settings
from core.army.army import Army
from core.army.army_builder import ArmyBuilder
from core.army.army_factory import ArmyFactory
from schemas import InitArmiesDTO


class GameManager:
    def __init__(self):
        self.alliance: Army | None = None
        self.horde: Army | None = None
        Settings.load_from_yaml('/Users/nikitapanferov/prog/stack-wars/conf/config.yaml')

    def start_new_game(self, armies: InitArmiesDTO):
        alliance_factory = ArmyFactory.factory("alliance")
        horde_factory = ArmyFactory.factory("horde")

        alliance_builder = ArmyBuilder(alliance_factory)
        horde_builder = ArmyBuilder(horde_factory)

        self.alliance = Army(alliance_builder, armies.alliance.dict())
        self.horde = Army(horde_builder, armies.horde.dict())
