from __future__ import annotations
from typing import Dict, List, Set

from shared.colour import Colour
from shared.direction import Direction
from shared.position import Position
from shared.exceptions import InvalidPositionException
from models.base_piece import BasePiece
from utility.movement_util import step_or_null


class King(BasePiece):

    def __init__(self, colour: Colour):
        super().__init__(colour)
        # Pre-compute castling target squares for every colour
        self._castling_positions: Dict[Colour, List[Position]] = {}
        try:
            for c in Colour:
                self._castling_positions[c] = [
                    Position.get(c, 0, 6),
                    Position.get(c, 0, 2),
                ]
        except InvalidPositionException:
            pass

    def _setup_directions(self):
        F, B, L, R = Direction.FORWARD, Direction.BACKWARD, Direction.LEFT, Direction.RIGHT
        self.directions = [
            [F, L], [F, R], [L, F], [R, F],
            [B, L], [B, R], [L, B], [R, B],
            [F], [B], [L], [R],
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

        # Castling
        for end in self._castling_positions.get(self.colour, []):
            if board_map.get(end) is None and self._is_castling_possible(board_map, start, end):
                position_set.add(end)

        return position_set

    def _is_castling_possible(
        self,
        board: Dict[Position, BasePiece],
        start: Position,
        end: Position,
    ) -> bool:
        from models.rook import Rook
        col = self.colour
        try:
            if start != Position.get(col, 0, 4):
                return False

            if end == Position.get(col, 0, 6):
                castle = board.get(Position.get(col, 0, 7))
                empty1 = board.get(Position.get(col, 0, 5))
                empty2 = board.get(Position.get(col, 0, 6))
                return (
                    isinstance(castle, Rook)
                    and castle.colour == col
                    and empty1 is None
                    and empty2 is None
                )

            if end == Position.get(col, 0, 2):
                castle = board.get(Position.get(col, 0, 0))
                empty1 = board.get(Position.get(col, 0, 1))
                empty2 = board.get(Position.get(col, 0, 2))
                empty3 = board.get(Position.get(col, 0, 3))
                return (
                    isinstance(castle, Rook)
                    and castle.colour == col
                    and empty1 is None
                    and empty2 is None
                    and empty3 is None
                )
        except InvalidPositionException:
            pass
        return False

    def __str__(self):
        return str(self.colour) + 'K'
