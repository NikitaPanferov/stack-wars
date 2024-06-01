from typing import AsyncGenerator, List

from core.army.army import Army
from core.army.army_builder import ArmyBuilder
from core.army.army_factory import ArmyFactory
from core.commands.actions.action_builder import ActionBuilder
from core.commands.commands.arrow import Arrow
from core.commands.commands.clone import Clone
from core.commands.commands.heal import Heal
from core.commands.manager import CommandManager
from core.commands.commands import Attack, Death

from core.strategy import AbcStrategy, OneLineStrategy, strategies
from core.units.archer import Archer
from core.units.interfaces.ability import Ability
from core.units.interfaces.cloneable import Cloneable
from core.units.interfaces.healable import Healable
from core.units.interfaces.unit import Unit
from core.units.paladin import Paladin
from core.units.wizard import Wizard
from misc.singleton import SingletonMeta
from schemas import InitArmiesDTO, Action, ActionType, NextStepDTO, GameStateDTO
from schemas.strategy_type import StrategyType
from schemas.unitDTO import ClassName_UnitType

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
        return GameStateDTO.from_class(alliance=self.alliance.units, horde=self.horde.units)

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
        while len(self.alliance.units) >= i + 1 and len(self.horde.units) >= i + 1:
            alliance_unit = self.alliance.units[i][0]
            horde_unit = self.horde.units[i][0]

            attack_command = Attack(alliance_unit, horde_unit)
            self.command_manager.execute(attack_command)
            self.action_builder.attack(alliance_unit.id, horde_unit.id, attack_command.taken_damage)

            if horde_unit.hp <= 0:
                death_command = Death(horde_unit, self.horde, self.strategy.handle_death, self.strategy.handle_undo)
                self.command_manager.execute(death_command)
                self.action_builder.death(alliance_unit.id, horde_unit.id, 1)

                if len(self.horde.units[i]) > 0:
                    horde_unit = self.alliance.units[i][0]
                else:
                    continue

            attack_command = Attack(horde_unit, alliance_unit)
            self.command_manager.execute(attack_command)
            self.action_builder.attack(horde_unit.id, alliance_unit.id, attack_command.taken_damage)

            if alliance_unit.hp <= 0:
                death_command = Death(alliance_unit, self.alliance, self.strategy.handle_death, self.strategy.handle_undo)
                self.command_manager.execute(death_command)
                self.action_builder.death(horde_unit.id, alliance_unit.id, 1)

            i += 1

    def __process_heal(self, unit: Paladin, army: Army):
        target = army.get_unit_target_in_range(unit)
        if not isinstance(target, Healable):
            return

        heal_command = Heal(target)
        self.command_manager.execute(heal_command)
        self.action_builder.heal(unit.id, target.id, heal_command.heal_value)

    def __process_archer(self, unit: Archer, army_from: Army, army_to: Army):
        i, j = army_from.find_unit(unit)
        if unit.range - j <= 0:
            return
        target = army_to.get_target_in_range(i, 0, unit.range - j)
        arrow_command = Arrow(unit, army_from, target)
        self.command_manager.execute(arrow_command)
        self.action_builder.arrow(unit.id, target.id, arrow_command.damage)

        if target.hp <= 0:
            death_command = Death(target, army_to, self.strategy.handle_death, self.strategy.handle_undo)
            self.command_manager.execute(death_command)
            self.action_builder.death(unit.id, target.id, 1)


    def __process_clone(self, unit: Wizard, army: Army):
        target = army.get_unit_target_in_range(unit)
        if not isinstance(target, Cloneable):
            return

        clone_command = Clone(unit, army, target)
        self.command_manager.execute(clone_command)
        self.action_builder.clone(unit.id, target.id, 1)

    def __process_ability(self, unit: Unit, army_from: Army, army_to: Army):
        if not isinstance(unit, Ability):
            return
        if isinstance(unit, Archer):
            self.__process_archer(unit, army_from, army_to)
        if isinstance(unit, Wizard):
            self.__process_clone(unit, army_from)
        if isinstance(unit, Paladin):
            self.__process_heal(unit, army_from)

    def next_step(self) -> NextStepDTO:
        self.__battle_of_firsts()

        is_alliance_not_end = is_horde_not_end = True
        alliance_iter = iter(self.alliance)
        horde_iter = iter(self.horde)

        while is_alliance_not_end or is_horde_not_end:
            if is_alliance_not_end:
                try:
                    self.__process_ability(next(alliance_iter), self.alliance, self.horde)
                except StopIteration:
                    is_alliance_not_end = False

            if is_horde_not_end:
                try:
                    self.__process_ability(next(horde_iter), self.horde, self.alliance)
                except StopIteration:
                    is_horde_not_end = False

        total_count_of_alliance = total_count(self.alliance.units)
        total_count_of_horde = total_count(self.horde.units)

        if total_count_of_alliance == 0 or total_count_of_horde == 0:
            if total_count(self.alliance.units) == 0:
                self.action_builder.win("horde", "alliance")
            else:
                self.action_builder.win("alliance", "horde")


        return NextStepDTO(
            actions=self.action_builder.build(),
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
