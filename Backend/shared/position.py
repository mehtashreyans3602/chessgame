from __future__ import annotations
from typing import Dict, Tuple, Optional

from .colour import Colour
from .direction import Direction
from .exceptions import InvalidPositionException


class Position:
    """
    Represents one of 96 polygons on the 3-player chess board.
    Each colour section has 4 rows (0-3) × 8 columns (0-7) = 32 positions.
    Index layout: BLUE 0-31, GREEN 32-63, RED 64-95.
    Within a section: index = row + 4*column.
    """

    _registry: Dict[Tuple[Colour, int, int], "Position"] = {}
    _by_index: Dict[int, "Position"] = {}

    def __init__(self, name: str, colour: Colour, row: int, column: int):
        self.name = name
        self._colour = colour
        self._row = row
        self._column = column
        self._index: int = colour.value * 32 + row + 4 * column

    # ------------------------------------------------------------------ #
    # Properties
    # ------------------------------------------------------------------ #

    @property
    def colour(self) -> Colour:
        return self._colour

    @property
    def row(self) -> int:
        return self._row

    @property
    def column(self) -> int:
        return self._column

    # ------------------------------------------------------------------ #
    # Factory / lookup helpers
    # ------------------------------------------------------------------ #

    @classmethod
    def get(cls, colour_or_index, row: Optional[int] = None, column: Optional[int] = None) -> "Position":
        """
        Two signatures:
          Position.get(index)                  → look up by global 0-95 index
          Position.get(colour, row, column)    → look up by colour+row+col
        """
        if row is None and column is None:
            # Called as get(int)
            index = colour_or_index
            if 0 <= index <= 95:
                return cls._by_index[index]
            raise InvalidPositionException("No such position.")
        else:
            colour = colour_or_index
            if 0 <= row <= 3 and 0 <= column <= 7:
                key = (colour, row, column)
                if key in cls._registry:
                    return cls._registry[key]
            raise InvalidPositionException("No such position.")

    # ------------------------------------------------------------------ #
    # Navigation — mirrors Java Position.neighbour()
    # ------------------------------------------------------------------ #

    def neighbour(self, direction: Direction) -> "Position":
        colour = self._colour
        row = self._row
        column = self._column

        if direction == Direction.FORWARD:
            if row < 3:
                return Position.get(colour, row + 1, column)
            # At the inner edge (row == 3): cross into another section
            next_colour_ord = (colour.value + 1) % 3
            far_colour_ord = (colour.value + 2) % 3
            if column < 4:
                return Position.get(Colour(next_colour_ord), 3, 7 - column)
            return Position.get(Colour(far_colour_ord), 3, 7 - column)

        elif direction == Direction.BACKWARD:
            if row == 0:
                raise InvalidPositionException("Moved off board")
            return Position.get(colour, row - 1, column)

        elif direction == Direction.LEFT:
            if column == 0:
                raise InvalidPositionException("Moved off board")
            return Position.get(colour, row, column - 1)

        elif direction == Direction.RIGHT:
            if column == 7:
                raise InvalidPositionException("Moved off board")
            return Position.get(colour, row, column + 1)

        raise InvalidPositionException("Unknown direction")

    # ------------------------------------------------------------------ #
    # Dunder helpers
    # ------------------------------------------------------------------ #

    def __str__(self) -> str:
        col_chars = 'abcdefgh'
        return str(self._colour) + col_chars[self._column] + str(self._row + 1)

    def __repr__(self) -> str:
        return f"Position({self.name})"

    def __eq__(self, other) -> bool:
        return isinstance(other, Position) and self._index == other._index

    def __hash__(self) -> int:
        return hash(self._index)


# ------------------------------------------------------------------ #
# Initialise all 96 positions at import time
# ------------------------------------------------------------------ #

def _init_positions():
    colour_prefixes = {Colour.BLUE: 'B', Colour.GREEN: 'G', Colour.RED: 'R'}
    col_chars = 'ABCDEFGH'
    for colour in Colour:
        for col_idx in range(8):
            for row_idx in range(4):
                col_char = col_chars[col_idx]
                name = f"{colour_prefixes[colour]}{col_char}{row_idx + 1}"
                p = Position(name, colour, row_idx, col_idx)
                Position._registry[(colour, row_idx, col_idx)] = p
                Position._by_index[p._index] = p


_init_positions()
