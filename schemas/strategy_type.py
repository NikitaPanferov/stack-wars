from enum import Enum


class StrategyType(str, Enum):
    one_line = 'one_line'
    multi_line = 'multi_line'
    wall_to_wall = 'wall_to_wall'
