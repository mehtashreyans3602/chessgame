from shared.colour import Colour
from models.base_piece import BasePiece
from models.bishop import Bishop
from models.king import King
from models.knight import Knight
from models.pawn import Pawn
from models.queen import Queen
from models.rook import Rook
from models.commander import Commander


def create_piece(piece_type: str, colour: Colour) -> BasePiece:
    t = piece_type.lower()
    if t == 'bishop':
        return Bishop(colour)
    if t == 'queen':
        return Queen(colour)
    if t == 'king':
        return King(colour)
    if t == 'knight':
        return Knight(colour)
    if t == 'rook':
        return Rook(colour)
    if t == 'pawn':
        return Pawn(colour)
    if t == 'commander':
        return Commander(colour)
    raise ValueError(f"Invalid chess piece type: {piece_type}")
