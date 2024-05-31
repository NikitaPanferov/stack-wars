from typing import AsyncGenerator, List

from core.army.army import Army
from core.army.army_builder import ArmyBuilder
from core.army.army_factory import ArmyFactory
from core.commands.manager import CommandManager
from core.commands.commands.attack import Attack

from core.strategy import AbcStrategy, OneLineStrategy, strategies
from misc.singleton import SingletonMeta
from schemas import InitArmiesDTO, Action, ActionType, NextStepDTO, GameStateDTO
from schemas.strategy_type import StrategyType


class GameManager(metaclass=SingletonMeta):
    def __init__(self):
        alliance_factory = ArmyFactory.factory("alliance")
        horde_factory = ArmyFactory.factory("horde")

        alliance_builder = ArmyBuilder(alliance_factory)
        horde_builder = ArmyBuilder(horde_factory)

        self.alliance = Army(alliance_builder)
        self.horde = Army(horde_builder)
        self.command_manager = CommandManager()
        self.strategy: AbcStrategy = OneLineStrategy()

    def __get_game_state(self) -> GameState:
        return GameState.from_class(alliance=self.alliance.units, horde=self.horde.units)

    def start_new_game(self, armies: InitArmiesDTO) -> GameState:
        self.alliance.init(armies.alliance)
        self.horde.init(armies.horde)

        return self.__get_game_state()

    def next_step(self) -> NextStepDTO:
        actions: List[Action] = []

        count_rows = max(len(self.alliance.units), len(self.horde.units))
        for row in range(count_rows):
            count_units = max(len(self.alliance.units[row]), len(self.horde.units[row]))

            for i in range(count_units):

                if i == 0:
                    alliance_unit = self.alliance.units[row][i]
                    horde_unit = self.horde.units[row][i]
                    attackCommand = Attack(alliance_unit, horde_unit)
                    self.command_manager.execute(attackCommand)
                    action = Action(
                        type=ActionType.attack,
                        object=alliance_unit.id,
                        subject=horde_unit.id,
                        value=attackCommand.taken_damage,
                    )
                    actions.append(action)

                    if horde_unit.hp <= 0:
                        self.strategy.handle_death(horde_unit, self.horde)
                        action = Action(
                            type=ActionType.death,
                            object=alliance_unit.id,
                            subject=horde_unit.id,
                            value=1,
                        )
                        actions.append(action)
                        continue

                    attackCommand = Attack(horde_unit, alliance_unit)
                    self.command_manager.execute(attackCommand)
                    action = Action(
                        type=ActionType.attack,
                        object=horde_unit.id,
                        subject=alliance_unit.id,
                        value=attackCommand.taken_damage,
                    )
                    actions.append(action)

                    if alliance_unit.hp <= 0:
                        self.strategy.handle_death(alliance_unit, self.alliance)
                        action = Action(
                            type=ActionType.death,
                            object=horde_unit.id,
                            subject=alliance_unit.id,
                            value=1,
                        )
                        actions.append(action)

        return NextStepDTO(
            actions=actions,
            game_state=self.__get_game_state()
        )

    def change_strategy(self, strategy: StrategyType) -> GameStateDTO:
        self.strategy = strategies[strategy]
        print(self.alliance.units, self.horde.units, '\n\n\n\n')
        self.strategy.rebuild_armies(alliance=self.alliance, horde=self.horde)
        print(self.alliance.units, self.horde.units)
        return self.__get_game_state()


async def game_manager() -> AsyncGenerator[GameManager, None]:
    try:
        yield GameManager()
    finally:
        pass
