from __future__ import annotations
from typing import Dict, Optional, Set

from shared.colour import Colour
from shared.position import Position
from shared.exceptions import InvalidMoveException, InvalidPositionException
from models.base_piece import BasePiece
from models.king import King
from models.pawn import Pawn
from models.queen import Queen
from models.commander import Commander
from utility.board_adapter import convert_model_board_to_view_board
from utility.piece_factory import create_piece


class Board:
    """
    Manages the full 3-player chess board state:
    - Piece placement and movement
    - Turn management
    - Check / checkmate detection
    - Pawn promotion and castling
    """

    def __init__(self):
        self._board_map: Dict[Position, BasePiece] = {}
        self._turn: Colour = Colour.BLUE
        self._game_over: bool = False
        self._winner: Optional[str] = None
        self._highlight_polygons: Set[Position] = set()

        for colour in Colour:
            self._place_chess_pieces(colour)

    # ------------------------------------------------------------------ #
    # Board setup
    # ------------------------------------------------------------------ #

    def _place_chess_pieces(self, colour: Colour) -> None:
        g = lambda r, c: Position.get(colour, r, c)

        self._board_map[g(0, 0)] = create_piece('Rook', colour)
        self._board_map[g(0, 7)] = create_piece('Rook', colour)
        self._board_map[g(0, 1)] = create_piece('Knight', colour)
        self._board_map[g(0, 6)] = create_piece('Knight', colour)
        self._board_map[g(0, 2)] = create_piece('Bishop', colour)
        self._board_map[g(0, 5)] = create_piece('Bishop', colour)
        self._board_map[g(0, 3)] = create_piece('Queen', colour)
        self._board_map[g(0, 4)] = create_piece('King', colour)

        for i in range(8):
            pos = g(1, i)
            if i == 3:
                self._board_map[pos] = create_piece('Commander', colour)
            else:
                self._board_map[pos] = create_piece('pawn', colour)

    # ------------------------------------------------------------------ #
    # Public API
    # ------------------------------------------------------------------ #

    @property
    def turn(self) -> Colour:
        return self._turn

    def get_turn(self) -> Colour:
        return self._turn

    def is_game_over(self) -> bool:
        return self._game_over

    def get_winner(self) -> Optional[str]:
        return self._winner

    def get_web_view_board(self) -> Dict[str, str]:
        return convert_model_board_to_view_board(self._board_map)

    def is_current_players_piece(self, position: Position) -> bool:
        piece = self._board_map.get(position)
        return piece is not None and piece.colour == self._turn

    def get_possible_moves(self, position: Position) -> Set[Position]:
        mover = self._board_map.get(position)
        if mover is None:
            return set()

        self._highlight_polygons = mover.get_highlight_polygons(self._board_map, position)
        mover_colour = mover.colour

        non_check_positions: Set[Position] = set()
        for end_pos in self._highlight_polygons:
            if not self._is_check_after_move(mover_colour, self._board_map, position, end_pos):
                non_check_positions.add(end_pos)

        return non_check_positions

    def move(self, start: Position, end: Position) -> None:
        if not self._is_legal_move(start, end):
            raise InvalidMoveException(f"Illegal Move: {start}-{end}")

        mover = self._board_map[start]
        del self._board_map[start]

        # Pawn promotion: landing on row 0 of an enemy section
        if isinstance(mover, Pawn) and end.row == 0 and end.colour != mover.colour:
            self._board_map[end] = Queen(mover.colour)
        else:
            self._board_map[end] = mover
            if isinstance(mover, Commander):
                mover.advance_mode()

        # Castling: move the rook when King castles
        if isinstance(mover, King) and start.column == 4 and start.row == 0:
            col = mover.colour
            try:
                if end.column == 2:                               # castle left
                    rook_pos = Position.get(col, 0, 0)
                    rook = self._board_map.pop(rook_pos, None)
                    if rook:
                        self._board_map[Position.get(col, 0, 3)] = rook
                elif end.column == 6:                             # castle right
                    rook_pos = Position.get(col, 0, 7)
                    rook = self._board_map.pop(rook_pos, None)
                    if rook:
                        self._board_map[Position.get(col, 0, 5)] = rook
            except InvalidPositionException:
                pass

        # Check for checkmate against the other two colours
        for c in Colour:
            if c != self._turn:
                if self._is_checkmate(c, self._board_map):
                    self._game_over = True
                    self._winner = str(mover.colour)

        self._turn = Colour((self._turn.value + 1) % 3)
        self._highlight_polygons = set()

    # ------------------------------------------------------------------ #
    # Private helpers
    # ------------------------------------------------------------------ #

    def _is_legal_move(self, start: Position, end: Position) -> bool:
        mover = self._board_map.get(start)
        if mover is None:
            return False

        if not self._highlight_polygons:
            self._highlight_polygons = mover.get_highlight_polygons(self._board_map, start)

        if end not in self._highlight_polygons:
            return False

        colour = mover.colour
        if self._is_check(colour, self._board_map):
            # Must escape check
            if self._is_check_after_move(colour, self._board_map, start, end):
                return False
        elif self._is_check_after_move(colour, self._board_map, start, end):
            # Move would put self in check
            return False

        return True

    def _is_check(
        self,
        colour: Colour,
        board_map: Dict[Position, BasePiece],
    ) -> bool:
        king_pos = self._get_king_position(colour, board_map)
        if king_pos is None:
            return False

        for pos, piece in board_map.items():
            if piece.colour != colour:
                targets = piece.get_highlight_polygons(board_map, pos)
                if king_pos in targets:
                    return True
        return False

    def _is_checkmate(
        self,
        colour: Colour,
        board_map: Dict[Position, BasePiece],
    ) -> bool:
        if not self._is_check(colour, board_map):
            return False

        for pos, piece in board_map.items():
            if piece.colour == colour:
                moves = piece.get_highlight_polygons(board_map, pos)
                for end_pos in moves:
                    if not self._is_check_after_move(colour, board_map, pos, end_pos):
                        return False
        return True

    def _is_check_after_move(
        self,
        colour: Colour,
        board_map: Dict[Position, BasePiece],
        start: Position,
        end: Position,
    ) -> bool:
        copy: Dict[Position, BasePiece] = dict(board_map)
        piece = copy.pop(start)
        copy[end] = piece
        return self._is_check(colour, copy)

    def _get_king_position(
        self,
        colour: Colour,
        board_map: Dict[Position, BasePiece],
    ) -> Optional[Position]:
        for pos, piece in board_map.items():
            if isinstance(piece, King) and piece.colour == colour:
                return pos
        return None
