from __future__ import annotations
from typing import Dict, Set

from shared.direction import Direction
from shared.position import Position
from models.base_piece import BasePiece
from utility.movement_util import step_or_null


class Knight(BasePiece):

    def _setup_directions(self):
        F, B, L, R = Direction.FORWARD, Direction.BACKWARD, Direction.LEFT, Direction.RIGHT
        self.directions = [
            [F, F, L], [F, F, R],
            [F, L, L], [F, R, R],
            [B, B, L], [B, B, R],
            [B, L, L], [B, R, R],
            [L, L, F], [L, L, B],
            [L, F, F], [L, B, B],
            [R, R, F], [R, R, B],
            [R, F, F], [R, B, B],
        ]

    def get_highlight_polygons(
        self,
        board_map: Dict[Position, BasePiece],
        start: Position,
    ) -> Set[Position]:
        position_set: Set[Position] = set()

        for step in self.directions:
            end = step_or_null(self, step, start)
            if end is None or end in position_set:
                continue

            target = board_map.get(end)
            if target is not None:
                if target.colour != self.colour:
                    position_set.add(end)
            else:
                position_set.add(end)

        return position_set

    def __str__(self):
        return str(self.colour) + 'N'
