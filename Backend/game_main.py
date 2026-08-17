from __future__ import annotations
from typing import Dict, List, Optional, Set

from shared.colour import Colour
from shared.position import Position
from shared.game_state import GameState
from shared.exceptions import InvalidMoveException, InvalidPositionException
from board import Board
from utility.board_adapter import calculate_polygon_id, convert_highlight_polygons_to_view_board


class GameMain:
    """
    Entry point for each game session.
    Receives polygon-click strings from the REST layer and drives Board logic.
    """

    def __init__(self):
        self._board = Board()
        self._move_start_pos: Optional[Position] = None
        self._move_end_pos: Optional[Position] = None
        self._highlight_polygons: Optional[Set[Position]] = set()

    # ------------------------------------------------------------------ #
    # IGameInterface equivalents
    # ------------------------------------------------------------------ #

    def get_board(self) -> Dict[str, str]:
        return self._board.get_web_view_board()

    def get_turn(self) -> Colour:
        return self._board.get_turn()

    def on_click(self, polygon_label: str) -> GameState:
        try:
            polygon_pos = calculate_polygon_id(polygon_label)
            position = Position.get(polygon_pos)

            if self._board.is_current_players_piece(position):
                # First click: select own piece
                self._move_start_pos = position
                self._highlight_polygons = self._board.get_possible_moves(self._move_start_pos)
                if not self._highlight_polygons:
                    self._move_start_pos = None

            elif self._move_start_pos is not None:
                # Second click: attempt the move
                self._move_end_pos = position
                self._board.move(self._move_start_pos, self._move_end_pos)
                self._move_start_pos = None
                self._move_end_pos = None
                self._highlight_polygons = None

        except (InvalidMoveException, InvalidPositionException) as e:
            self._move_start_pos = None
            self._move_end_pos = None
            self._highlight_polygons = None

        highlighted = convert_highlight_polygons_to_view_board(self._highlight_polygons)
        response = GameState(self.get_board(), highlighted)

        if self._board.is_game_over():
            winner = self._board.get_winner()
            response.set_game_over(winner)

        return response
