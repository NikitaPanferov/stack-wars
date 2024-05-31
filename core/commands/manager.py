from typing import List

from core.commands.command import Command


class CommandManager:
    def __init__(self):
        self._history: List[List[Command]] = [[]]
        self._current_step = 0

    def _get_last_step(self) -> List[Command]:
        return self._history[self._current_step]

    def execute(self, command: Command, new: bool = False):
        if new:
            self._history.append([])
            self._current_step += 1

        command.do()
        self._get_last_step().append(command)

    def undo(self):
        if self._current_step == 0:
            return

        last_step = self._get_last_step()

        for action in last_step:
            action.undo()

        self._current_step -= 1

    def redo(self):
        if self._current_step == len(self._history) -1:
            return

        next_step = self._history[self._current_step + 1]

        for action in next_step:
            action.do()

        self._current_step += 1
