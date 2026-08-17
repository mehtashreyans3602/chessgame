from __future__ import annotations
from typing import Dict, Set

from shared.direction import Direction
from shared.position import Position
from models.base_piece import BasePiece
from utility.movement_util import step_or_null


class Bishop(BasePiece):

    def _setup_directions(self):
        F, B, L, R = Direction.FORWARD, Direction.BACKWARD, Direction.LEFT, Direction.RIGHT
        self.directions = [
            [F, L], [F, R], [L, F], [R, F],
            [B, L], [B, R], [L, B], [R, B],
        ]

    def get_highlight_polygons(
        self,
        board_map: Dict[Position, BasePiece],
        start: Position,
    ) -> Set[Position]:
        position_set: Set[Position] = set()

        for step in self.directions:
            tmp = step_or_null(self, step, start)

            while tmp is not None and tmp not in position_set and board_map.get(tmp) is None:
                position_set.add(tmp)
                tmp = step_or_null(self, step, tmp, tmp.colour != start.colour)

            if tmp is not None and board_map.get(tmp) is not None:
                if board_map[tmp].colour != self.colour:
                    position_set.add(tmp)

        return position_set

    def __str__(self):
        return str(self.colour) + 'B'
