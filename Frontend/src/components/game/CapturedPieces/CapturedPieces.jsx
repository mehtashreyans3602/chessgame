import React from 'react';
import styles from './CapturedPieces.module.css';

/**
 * CapturedPieces Component - Shows captured pieces for each player
 */
const CapturedPieces = ({ capturedPieces }) => {
    const getPieceImage = (colorCode, pieceType) => {
        const colorMap = { 'R': 'red', 'G': 'green', 'B': 'blue' };
        const pieceMap = { 'R': 'rook', 'N': 'knight', 'B': 'bishop', 'Q': 'queen', 'K': 'king', 'P': 'pawn', 'J': 'pawn', 'W': 'pawn' };
        
        const color = colorMap[colorCode];
        const piece = pieceMap[pieceType];
        
        if (!color || !piece) return null;
        
        try {
            return require(`../../../assets/pieces/${piece}-${color}.svg`);
        } catch (error) {
            return null;
        }
    };

    const playerColors = [
        { code: 'B', name: 'Blue', color: '#5dade2' },
        { code: 'G', name: 'Green', color: '#76d7c4' },
        { code: 'R', name: 'Red', color: '#ec7063' }
    ];

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Captured Pieces</h3>
            {playerColors.map(player => (
                <div key={player.code} className={styles.playerSection}>
                    <h4 className={styles.playerName} style={{ color: player.color }}>
                        {player.name}
                    </h4>
                    <div className={styles.piecesGrid}>
                        {(capturedPieces[player.code] || []).map((pieceCode, index) => {
                            const imageSrc = getPieceImage(pieceCode[0], pieceCode[1]);
                            return imageSrc ? (
                                <img
                                    key={index}
                                    src={imageSrc}
                                    alt={pieceCode}
                                    className={styles.capturedPiece}
                                />
                            ) : null;
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CapturedPieces;