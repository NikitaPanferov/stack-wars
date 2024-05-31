from typing import AsyncGenerator, List

from core.army.army import Army
from core.army.army_builder import ArmyBuilder
from core.army.army_factory import ArmyFactory
from core.commands.manager import CommandManager
from core.commands.commands.attack import Attack

from core.strategy import AbcStrategy, OneLineStrategy
from misc.singleton import SingletonMeta
from schemas import InitArmiesDTO, Action, ActionType, UnitDTO, NextStepDTO, GameState


class GameManager(metaclass=SingletonMeta):
    def __init__(self):
        self.alliance: Army | None = None
        self.horde: Army | None = None
        self.command_manager = CommandManager()
        self.strategy: AbcStrategy = OneLineStrategy()

    def start_new_game(self, armies: InitArmiesDTO) -> GameState:
        alliance_factory = ArmyFactory.factory("alliance")
        horde_factory = ArmyFactory.factory("horde")

        alliance_builder = ArmyBuilder(alliance_factory)
        horde_builder = ArmyBuilder(horde_factory)

        self.alliance = Army(alliance_builder, armies.alliance)
        self.horde = Army(horde_builder, armies.horde)

        return GameState.from_class(alliance=self.alliance.units, horde=self.horde.units)

    def next_step(self) -> NextStepDTO:
        actions: List[Action] = []

        count_rows = max(len(self.alliance.units), len(self.horde.units))
        for row in range(count_rows):
            count_units = max(len(self.alliance.units[row]), len(self.horde.units[row]))

            for i in range(count_units):
                alliance_unit = self.alliance.units[row][i]
                horde_unit = self.horde.units[row][i]

                if i == 0:
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
            game_state=GameState(
                alliance=[[UnitDTO.from_orm(unit) for unit in row] for row in self.alliance.units],
                horde=[[UnitDTO.from_orm(unit) for unit in row] for row in self.horde.units],
            ),
        )


async def game_manager() -> AsyncGenerator[GameManager, None]:
    try:
        yield GameManager()
    finally:
        pass
