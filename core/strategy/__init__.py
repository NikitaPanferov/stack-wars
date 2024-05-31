from schemas.strategy_type import StrategyType
from .AbcStrategy import AbcStrategy
from .OneLineStrategy import OneLineStrategy
from .MultiLineStrategy import MultiLineStrategy
from .WallToWallStrategy import WallToWallStrategy

strategies = {
    StrategyType.one_line: OneLineStrategy(),
    StrategyType.multi_line: MultiLineStrategy(),
    StrategyType.wall_to_wall: WallToWallStrategy(),
}