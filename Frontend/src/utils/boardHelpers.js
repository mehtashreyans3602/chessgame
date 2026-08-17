/**
 * Check if a polygon is highlighted
 */
export const isPolygonHighlighted = (polygonId, highlightedMoves) => {
    return highlightedMoves.includes(polygonId);
};

/**
 * Get piece info from board state
 */
export const getPieceAt = (polygonId, boardState) => {
    const pieceCode = boardState[polygonId];
    if (!pieceCode || pieceCode.length < 2) return null;

    return {
        color: pieceCode[0], // R, G, or B
        type: pieceCode[1],  // R, N, B, Q, K, P, J, W
        code: pieceCode,
    };
};

/**
 * Check if polygon has a piece
 */
export const hasPiece = (polygonId, boardState) => {
    return !!boardState[polygonId];
};

/**
 * Get polygon center coordinates
 */
export const getPolygonCenter = (points) => {
    if (!points || points.length < 3) return { x: 0, y: 0 };

    // points should be array of {x, y} objects
    const x = (points[0].x + points[2].x) / 2;
    const y = (points[0].y + points[2].y) / 2;

    return { x, y };
};
