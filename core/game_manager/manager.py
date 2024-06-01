from typing import AsyncGenerator, List

from core.army.army import Army
from core.army.army_builder import ArmyBuilder
from core.army.army_factory import ArmyFactory
from core.commands.actions.action_builder import ActionBuilder
from core.commands.manager import CommandManager
from core.commands.commands import Attack, Death

from core.strategy import AbcStrategy, OneLineStrategy, strategies
from misc.singleton import SingletonMeta
from schemas import InitArmiesDTO, Action, ActionType, NextStepDTO, GameStateDTO
from schemas.strategy_type import StrategyType

from misc import total_count


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
        self.action_builder: ActionBuilder = ActionBuilder()

    def __get_game_state(self) -> GameStateDTO:
        return GameStateDTO.from_class(
            alliance=self.alliance.units, horde=self.horde.units
        )

    def start_new_game(self, armies: InitArmiesDTO) -> GameStateDTO:
        alliance_factory = ArmyFactory.factory("alliance")
        horde_factory = ArmyFactory.factory("horde")

        alliance_builder = ArmyBuilder(alliance_factory)
        horde_builder = ArmyBuilder(horde_factory)

        self.alliance = Army(alliance_builder)
        self.horde = Army(horde_builder)

        self.alliance.init(armies.alliance)
        self.horde.init(armies.horde)

        return self.__get_game_state()

    def __battle_of_firsts(self):
        i = 0
        while (
            len(self.alliance.units) >= i + 1
            and len(self.horde.units) >= i + 1
            and self.alliance.units[i][0]
            and self.horde.units[i][0]
        ):
            alliance_unit = self.alliance.units[i][0]
            horde_unit = self.horde.units[i][0]

            attack_command = Attack(alliance_unit, horde_unit)
            self.command_manager.execute(attack_command)
            self.action_builder.attack(
                alliance_unit.id, horde_unit.id, attack_command.taken_damage
            )

            if horde_unit.hp <= 0:
                death_command = Death(
                    horde_unit,
                    self.horde,
                    self.strategy.handle_death,
                    self.strategy.handle_undo,
                )
                self.command_manager.execute(death_command)
                self.action_builder.death(alliance_unit.id, horde_unit.id, 1)

                if self.horde.units[i]:
                    horde_unit = self.horde.units[i][0]
                else:
                    i += 1
                    continue

            attack_command = Attack(horde_unit, alliance_unit)
            self.command_manager.execute(attack_command)
            self.action_builder.attack(
                horde_unit.id, alliance_unit.id, attack_command.taken_damage
            )

            if alliance_unit.hp <= 0:
                death_command = Death(
                    alliance_unit,
                    self.alliance,
                    self.strategy.handle_death,
                    self.strategy.handle_undo,
                )
                self.command_manager.execute(death_command)
                self.action_builder.death(horde_unit.id, alliance_unit.id, 1)

            i += 1

    def next_step(self) -> NextStepDTO:
        self.__battle_of_firsts()

        # count_rows = min(len(self.alliance.units), len(self.horde.units))
        # i = 0
        # while max([len(arr) for arr in self.alliance.units]) >= i + 1 or max(
        #         [len(arr) for arr in self.horde.units]) >= i + 1:
        #     while count_rows

        #     for row in range(count_rows):
        #     count_units = max(len(self.alliance.units[row]), len(self.horde.units[row]))

        #     # rows = len(array)
        #     # cols = len(array[0])
        #     # for col in range(cols):
        #     #     for row in range(rows):
        #     #         result.append(array[row][col])

        #     for i in range(count_units):

        #         if i == 0:
        #             alliance_unit = self.alliance.units[row][i]
        #             horde_unit = self.horde.units[row][i]
        #             attackCommand = Attack(alliance_unit, horde_unit)
        #             self.command_manager.execute(attackCommand)
        #             action = Action(
        #                 type=ActionType.attack,
        #                 object=alliance_unit.id,
        #                 subject=horde_unit.id,
        #                 value=attackCommand.taken_damage,
        #             )
        #             actions.append(action)

        #             if horde_unit.hp <= 0:
        #                 self.strategy.handle_death(horde_unit, self.horde)
        #                 action = Action(
        #                     type=ActionType.death,
        #                     object=alliance_unit.id,
        #                     subject=horde_unit.id,
        #                     value=1,
        #                 )
        #                 actions.append(action)
        #                 continue

        #             attackCommand = Attack(horde_unit, alliance_unit)
        #             self.command_manager.execute(attackCommand)
        #             action = Action(
        #                 type=ActionType.attack,
        #                 object=horde_unit.id,
        #                 subject=alliance_unit.id,
        #                 value=attackCommand.taken_damage,
        #             )
        #             actions.append(action)

        #             if alliance_unit.hp <= 0:
        #                 self.strategy.handle_death(alliance_unit, self.alliance)
        #                 action = Action(
        #                     type=ActionType.death,
        #                     object=horde_unit.id,
        #                     subject=alliance_unit.id,
        #                     value=1,
        #                 )
        #                 actions.append(action)

        total_count_of_alliance = total_count(self.alliance.units)
        total_count_of_horde = total_count(self.horde.units)
        
        if total_count_of_alliance == 0 or total_count_of_horde == 0:
            if total_count(self.alliance.units) == 0:
                self.action_builder.win("horde", "alliance")
            else:
                self.action_builder.win("alliance", "horde")

        return NextStepDTO(
            actions=self.action_builder.build(), game_state=self.__get_game_state()
        )

    def change_strategy(self, strategy: StrategyType) -> GameStateDTO:
        self.strategy = strategies[strategy]
        print(self.alliance.units, self.horde.units, "\n\n\n\n")
        self.strategy.rebuild_armies(alliance=self.alliance, horde=self.horde)
        print(self.alliance.units, self.horde.units)
        return self.__get_game_state()


async def game_manager() -> AsyncGenerator[GameManager, None]:
    try:
        yield GameManager()
    finally:
        pass
