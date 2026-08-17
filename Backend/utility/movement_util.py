from __future__ import annotations
from typing import Optional, TYPE_CHECKING

from shared.direction import Direction
from shared.position import Position
from shared.exceptions import InvalidPositionException

if TYPE_CHECKING:
    from models.base_piece import BasePiece


def step(
    piece: "BasePiece",
    directions: list[Direction],
    current: Position,
    reverse: bool = False,
) -> Position:
    """
    Walk *directions* one step at a time from *current*, handling:
      - pawn direction-reversal when crossing into enemy territory
      - general reversal when crossing a colour boundary
    Raises InvalidPositionException if the path goes off the board.
    """
    # Import here to avoid circular dependency
    from models.pawn import Pawn

    internal_reverse = reverse

    for d in directions:
        is_pawn_on_enemy_side = (
            isinstance(piece, Pawn) and piece.colour != current.colour
        )
        if is_pawn_on_enemy_side or internal_reverse:
            # Flip direction when reversed
            if d == Direction.FORWARD:
                d = Direction.BACKWARD
            elif d == Direction.BACKWARD:
                d = Direction.FORWARD
            elif d == Direction.LEFT:
                d = Direction.RIGHT
            elif d == Direction.RIGHT:
                d = Direction.LEFT

        nxt = current.neighbour(d)

        if nxt.colour != current.colour:
            # Crossing a colour boundary — future steps must be reversed
            internal_reverse = True

        current = nxt

    return current


def step_or_null(
    piece: "BasePiece",
    directions: list[Direction],
    current: Position,
    reverse: bool = False,
) -> Optional[Position]:
    """Like step() but returns None instead of raising."""
    try:
        return step(piece, directions, current, reverse)
    except InvalidPositionException:
        return None
