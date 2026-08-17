import React from 'react';
import Polygon from '../Polygon/Polygon';
import Piece from '../Piece/Piece';
import { BOARD_POLYGONS, SVG_CONFIG } from './boardConfig';
import { useGameState } from '../../../hooks/useGameState';
import { isPolygonHighlighted } from '../../../utils/boardHelpers';
import styles from './ChessBoard.module.css';

/**
 * ChessBoard Component - Main game board with SVG rendering
 */
const ChessBoard = () => {
    const {
        boardState,
        highlightedMoves,
        handlePolygonClick,
    } = useGameState();

    const onPolygonClick = (polygonId) => {
        handlePolygonClick(polygonId);
    };

    return (
        <div className={styles.boardContainer}>
            <svg
                className={styles.svg}
                width={SVG_CONFIG.width}
                height={SVG_CONFIG.height}
                viewBox={SVG_CONFIG.viewBox}
                style={{ backgroundColor: SVG_CONFIG.backgroundColor }}
            >
                {/* Render all polygons */}
                {BOARD_POLYGONS.map((polygon) => (
                    <Polygon
                        key={polygon.id}
                        id={polygon.id}
                        points={polygon.points}
                        color={polygon.color}
                        shade={polygon.shade}
                        isHighlighted={isPolygonHighlighted(polygon.id, highlightedMoves)}
                        onClick={onPolygonClick}
                    />
                ))}

                {/* Render all pieces on top of polygons */}
                {Object.entries(boardState).map(([polygonId, pieceCode]) => {
                    const polygon = BOARD_POLYGONS.find((p) => p.id === polygonId);
                    if (!polygon) return null;

                    return (
                        <Piece
                            key={`piece-${polygonId}`}
                            polygonId={polygonId}
                            pieceCode={pieceCode}
                            points={polygon.points}
                        />
                    );
                })}
            </svg>


        </div>
    );
};

export default ChessBoard;
