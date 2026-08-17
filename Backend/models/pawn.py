from __future__ import annotations
from typing import Dict, Set

from shared.colour import Colour
from shared.direction import Direction
from shared.position import Position
from shared.exceptions import InvalidPositionException
from models.base_piece import BasePiece
from utility.movement_util import step_or_null


class Pawn(BasePiece):

    def _setup_directions(self):
        F, B, L, R = Direction.FORWARD, Direction.BACKWARD, Direction.LEFT, Direction.RIGHT
        self.directions = [
            [F],
            [F, F],
            [F, L],
            [L, F],
            [F, R],
            [R, F],
        ]

    def get_highlight_polygons(
        self,
        board_map: Dict[Position, BasePiece],
        start: Position,
    ) -> Set[Position]:
        position_set: Set[Position] = set()
        mover_col = self.colour

        for i, step in enumerate(self.directions):
            end = step_or_null(self, step, start)
            if end is None or end in position_set:
                continue

            target = board_map.get(end)

            try:
                # 1-step forward, nothing blocking
                is_one_forward = (target is None and i == 0)
                # 2-step forward from starting row, path clear
                is_two_forward = (
                    target is None
                    and i == 1
                    and start.colour == mover_col
                    and start.row == 1
                    and board_map.get(Position.get(mover_col, 2, start.column)) is None
                )
                # Diagonal capture
                is_diagonal_capture = (
                    target is not None
                    and target.colour != mover_col
                    and i > 1
                )

                if is_one_forward or is_two_forward or is_diagonal_capture:
                    position_set.add(end)

            except InvalidPositionException:
                pass

        return position_set

    def __str__(self):
        return str(self.colour) + 'P'
