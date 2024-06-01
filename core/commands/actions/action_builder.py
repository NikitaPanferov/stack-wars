from typing import List

from schemas import Action, ActionType


class ActionBuilder:
    def __init__(self):
        self.actions: List[Action] = []

    def attack(self, object: str, subject: str, value: int):
        self.actions.append(Action(
            type=ActionType.attack,
            object=object,
            subject=subject,
            value=value,
        ))

    def death(self, object: str, subject: str, value: int):
        self.actions.append(Action(
            type=ActionType.death,
            object=object,
            subject=subject,
            value=value,
        ))

    def arrow(self, object: str, subject: str, value: int):
        self.actions.append(Action(
            type=ActionType.arrow,
            object=object,
            subject=subject,
            value=value,
        ))

    def clone(self, object: str, subject: str, value: int):
        self.actions.append(Action(
            type=ActionType.clone,
            object=object,
            subject=subject,
            value=value,
        ))

    def heal(self, object: str, subject: str, value: int):
        self.actions.append(Action(
            type=ActionType.heal,
            object=object,
            subject=subject,
            value=value,
        ))

    def move(self, object: str, subject: str, value: int):
        self.actions.append(Action(
            type=ActionType.move,
            object=object,
            subject=subject,
            value=value,
        ))
        
    def win(self, winner: str, looser: str):
        self.actions.append(Action(
            type=ActionType.win,
            object=winner,
            subject=looser,
            value=1
        ))

    def build(self) -> List[Action]:
        actions = [*self.actions]
        self.actions = []
        return actions
