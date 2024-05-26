from enum import Enum

from pydantic import BaseModel


class ActionType(str, Enum):
    death = 'death'
    attack = 'attack'
    arrow = 'arrow'
    clone = 'clone'
    heal = 'heal'
    move = 'move'


class Action(BaseModel):
    type: ActionType
    object: int
    subject: int
    value: int
