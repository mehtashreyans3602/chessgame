import React from 'react';
import styles from './Piece.module.css';

/**
 * Piece Component - Renders a chess piece on the board using SVG images
 * @param {Object} props
 * @param {string} props.polygonId - ID of the polygon where piece is located
 * @param {string} props.pieceCode - Two character code (e.g., "BR" = Blue Rook)
 * @param {string} props.points - Polygon points to calculate center position
 */
const Piece = ({ polygonId, pieceCode, points }) => {
    if (!pieceCode || pieceCode.length < 2) return null;

    const colorCode = pieceCode[0]; // R, G, or B
    const pieceType = pieceCode[1]; // R, N, B, Q, K, P, J, W

    const { x, y } = getPolygonCenter(points);
    const svgSrc = getPieceSVG(colorCode, pieceType);

    if (!svgSrc) {
        console.log('No SVG found for:', polygonId, pieceCode);
        return null;
    }

    return (
        <image
            x={x - 20}
            y={y - 20}
            width="40"
            height="40"
            href={svgSrc}
            className={styles.piece}
        />
    );
};

/**
 * Helper function to get piece SVG path
 */
const getPieceSVG = (colorCode, pieceType) => {
    const colorMap = { 'R': 'red', 'G': 'green', 'B': 'blue' };
    const pieceMap = { 'R': 'rook', 'N': 'knight', 'B': 'bishop', 'Q': 'queen', 'K': 'king', 'P': 'pawn', 'J': 'pawn', 'W': 'pawn', 'H': 'commander' };

    const color = colorMap[colorCode];
    const piece = pieceMap[pieceType];

    if (!color || !piece) return null;

    try {
        return require(`../../../assets/pieces/${piece}-${color}.svg`);
    } catch (error) {
        console.error('SVG not found:', `${piece} - ${color}.svg`);
        return null;
    }
};



/**
 * Helper function to calculate polygon center from points string
 */
const getPolygonCenter = (pointsString) => {
    const points = pointsString.split(' ');
    if (points.length < 3) return { x: 0, y: 0 };

    const firstPoint = points[0].split(',');
    const thirdPoint = points[2].split(',');

    const x = (parseFloat(firstPoint[0]) + parseFloat(thirdPoint[0])) / 2;
    const y = (parseFloat(firstPoint[1]) + parseFloat(thirdPoint[1])) / 2;

    return { x, y };
};

export default Piece;
