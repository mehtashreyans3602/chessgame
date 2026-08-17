from __future__ import annotations
from enum import Enum
from typing import Dict, Optional, Set

from shared.colour import Colour
from shared.position import Position
from models.base_piece import BasePiece
from models.knight import Knight
from models.bishop import Bishop


class _MoveMode(Enum):
    KNIGHT = 'KNIGHT'
    BISHOP = 'BISHOP'


class Commander(BasePiece):
    """
    Custom 3-player-chess piece.
    First move: may move as either Knight or Bishop (union of both).
    Subsequent moves: strictly alternates Knight → Bishop → Knight → …
    """

    def __init__(self, colour: Colour):
        super().__init__(colour)
        self._knight = Knight(colour)
        self._bishop = Bishop(colour)
        self._current_mode: Optional[_MoveMode] = None  # None = first move

    def _setup_directions(self):
        self.directions = []  # delegated to sub-pieces

    def get_highlight_polygons(
        self,
        board_map: Dict[Position, BasePiece],
        start: Position,
    ) -> Set[Position]:
        if self._current_mode is None:
            # First move: show both options
            return (
                self._knight.get_highlight_polygons(board_map, start)
                | self._bishop.get_highlight_polygons(board_map, start)
            )
        if self._current_mode == _MoveMode.KNIGHT:
            return self._knight.get_highlight_polygons(board_map, start)
        return self._bishop.get_highlight_polygons(board_map, start)

    def advance_mode(self) -> None:
        """Must be called after every successful move."""
        if self._current_mode is None or self._current_mode == _MoveMode.BISHOP:
            self._current_mode = _MoveMode.KNIGHT
        else:
            self._current_mode = _MoveMode.BISHOP

    def __str__(self):
        return str(self.colour) + 'H'
