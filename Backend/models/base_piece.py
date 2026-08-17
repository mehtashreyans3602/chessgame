from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Dict, List, Set, TYPE_CHECKING

from shared.colour import Colour
from shared.direction import Direction
from shared.position import Position

if TYPE_CHECKING:
    pass


class BasePiece(ABC):
    """Abstract base class for all chess pieces."""

    def __init__(self, colour: Colour):
        self.colour: Colour = colour
        self.directions: List[List[Direction]] = []
        self._setup_directions()

    @abstractmethod
    def _setup_directions(self) -> None:
        """Populate self.directions with the move patterns for this piece."""

    @abstractmethod
    def get_highlight_polygons(
        self,
        board_map: Dict[Position, "BasePiece"],
        start: Position,
    ) -> Set[Position]:
        """Return all positions this piece can legally move to (ignoring check)."""
