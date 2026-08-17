from typing import Dict, List, Optional


class GameState:
    """Serialisable response sent to the React frontend after every click."""

    def __init__(self, board: Dict[str, str], highlighted_polygons: List[str]):
        self.board = board
        self.highlighted_polygons = highlighted_polygons
        self.is_game_over: bool = False
        self.winner: Optional[str] = None

    def set_game_over(self, winner: str) -> None:
        self.is_game_over = True
        self.winner = winner

    def to_dict(self) -> dict:
        d: dict = {
            "board": self.board,
            "highlightedPolygons": self.highlighted_polygons,
            "isGameOver": self.is_game_over,
        }
        if self.winner is not None:
            d["winner"] = self.winner
        return d

    def __repr__(self) -> str:
        return (
            f"GameState(highlighted={self.highlighted_polygons}, "
            f"board={self.board})"
        )
