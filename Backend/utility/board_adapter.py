from __future__ import annotations
from typing import Dict, List, Optional, Set, TYPE_CHECKING

from shared.position import Position
from shared.exceptions import InvalidPositionException

if TYPE_CHECKING:
    from models.base_piece import BasePiece


def convert_model_board_to_view_board(
    model_board: Dict[Position, "BasePiece"]
) -> Dict[str, str]:
    """Convert {Position: BasePiece} → {str: str} for the React frontend."""
    view_board: Dict[str, str] = {}
    for pos, piece in model_board.items():
        if piece is not None:
            view_board[str(pos)] = str(piece)
    return view_board


def convert_highlight_polygons_to_view_board(
    possible_moves: Optional[Set[Position]],
) -> List[str]:
    """Convert a set of Positions → list of polygon-label strings."""
    if not possible_moves:
        return []
    return [str(p) for p in possible_moves]


def calculate_polygon_id(polygon: str) -> int:
    """
    Decode a polygon label (e.g. 'Bd2') to its 0-95 index.

    Format: <colour-char><column-char><row-digit>
      colour-char : B / G / R  (case-insensitive)
      column-char : a-h         (case-insensitive)
      row-digit   : 1-4
    """
    if (
        polygon is None
        or len(polygon) != 3
        or not polygon[0].isalpha()
        or not polygon[1].isalpha()
        or not polygon[2].isdigit()
    ):
        raise InvalidPositionException(f"Invalid String position: {polygon}")

    first = polygon[0].lower()
    second = polygon[1].lower()
    number = int(polygon[2])

    if first not in ('b', 'g', 'r'):
        raise InvalidPositionException(f"Invalid String position: {polygon}")
    if second < 'a' or second > 'h':
        raise InvalidPositionException(f"Invalid String position: {polygon}")
    if number < 1 or number > 4:
        raise InvalidPositionException(f"Invalid String position: {polygon}")

    colour_offsets = {'b': 0, 'g': 32, 'r': 64}
    offset = colour_offsets[first]
    y = ord(second) - ord('a')   # column index 0-7
    x = number - 1               # row index 0-3

    return offset + x + 4 * y
