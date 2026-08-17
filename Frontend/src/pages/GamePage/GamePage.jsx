import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChessBoard from '../../components/game/ChessBoard/ChessBoard';
import ThemeSelector from '../../components/game/ThemeSelector/ThemeSelector';
import GameStatus from '../../components/game/GameStatus/GameStatus';
import GameOverModal from '../../components/game/GameOverModal/GameOverModal';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerContext } from '../../context/PlayerContext';
import { useGameContext } from '../../context/GameContext';
import styles from './GamePage.module.css';

/**
 * Game Page Component - Main game interface with three-panel layout
 */
const GamePage = () => {
    const navigate = useNavigate();
    const { areAllPlayersSet } = usePlayerContext();
    const { gameOver, winner, resetGame } = useGameContext();
    const { currentPlayer, error, initializeGame } = useGameState();

    // Redirect to landing page if players are not set
    useEffect(() => {
        if (!areAllPlayersSet()) {
            navigate('/');
        }
    }, [areAllPlayersSet, navigate]);

    // Initialize game on mount
    useEffect(() => {
        initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle API errors
    useEffect(() => {
        if (error) {
            alert(`Game Error: ${error}. Please restart the game.`);
        }
    }, [error]);

    const handleCloseGameOver = () => {
        resetGame();
    };

    return (
        <div className={styles.container}>
            {/* Main Panel - Chess Board */}
            <div className={styles.mainPanel}>
                <h1 className={styles.title}>THREE PLAYER CHESS GAME</h1>
                <div className={styles.boardWrapper}>
                    <ChessBoard />
                </div>
            </div>

            {/* Right Panel - Game Status */}
            <div className={styles.rightPanel}>
                <ThemeSelector />
                <GameStatus currentPlayer={currentPlayer} />
            </div>

            {/* Game Over Modal */}
            <GameOverModal
                isOpen={gameOver}
                winner={winner}
                onClose={handleCloseGameOver}
            />
        </div>
    );
};

export default GamePage;