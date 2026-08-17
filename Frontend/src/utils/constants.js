/**
 * Maps piece tokens to Unicode chess symbols
 */
export const PIECE_MAP = {
    R: '♖', // Rook
    N: '♘', // Knight
    B: '♗', // Bishop
    Q: '♕', // Queen
    K: '♔', // King
    P: '♙', // Pawn
    J: '♙', // Pawn (was Jester)
    W: '♙', // Pawn (was Wall)
};

/**
 * Maps color codes to full color names
 */
export const COLOR_MAP = {
    R: 'Red',
    G: 'Green',
    B: 'Blue',
};

/**
 * Maps color names to hex codes
 */
export const COLOR_HEX = {
    Red: '#ec7063',
    Green: '#76d7c4',
    Blue: '#5dade2',
};

/**
 * Available themes
 */
export const THEME_OPTIONS = [
    { id: 'arialTheme', label: 'Arial', value: 'arialTheme' },
    { id: 'freeSerifTheme', label: 'Free Serif', value: 'freeSerifTheme' },
    { id: 'dejaVuSansTheme', label: 'Dejavu Sans', value: 'dejaVuSansTheme' },
];
