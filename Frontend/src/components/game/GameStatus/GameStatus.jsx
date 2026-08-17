import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerContext } from '../../../context/PlayerContext';
import { useGameContext } from '../../../context/GameContext';
import { COLOR_MAP } from '../../../utils/constants';
import Button from '../../shared/Button/Button';
import { soundManager } from '../../../utils/sounds';

import styles from './GameStatus.module.css';

/**
 * Game Status Component - Right panel showing current player
 * @param {Object} props
 * @param {string} props.currentPlayer - Current player color code ('R', 'G', 'B')
 */
const GameStatus = ({ currentPlayer }) => {
    const navigate = useNavigate();
    const { players, clearPlayers } = usePlayerContext();
    const { resetGame } = useGameContext();
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    const getKingImage = (colorCode) => {
        const colorMap = { 'R': 'red', 'G': 'green', 'B': 'blue' };
        const color = colorMap[colorCode];
        if (!color) return null;
        return require(`../../../assets/pieces/king-${color}.svg`);
    };

    const colorName = COLOR_MAP[currentPlayer] || 'Unknown';
    const playerName = players[colorName] || 'Unknown';
    const kingImage = getKingImage(currentPlayer);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Game Status</h2>
            <div className={styles.playerInfo}>
                <p className={styles.label}>Current Player:</p>
                <div className={styles.playerDisplay}>
                    <p className={styles.playerName}>{playerName}</p>
                    {kingImage && (
                        <img 
                            src={kingImage} 
                            alt={`${colorName} King`}
                            className={styles.kingIcon}
                        />
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                <Button 
                    onClick={() => {
                        const enabled = soundManager.toggle();
                        setSoundEnabled(enabled);
                    }}
                    variant="secondary"
                >
                    Sound: {soundEnabled ? 'ON' : 'OFF'}
                </Button>
                <Button 
                    onClick={() => {
                        resetGame();
                        clearPlayers();
                        navigate('/');
                    }}
                    variant="secondary"
                >
                    End Game
                </Button>
            </div>
        </div>
    );
};

export default GameStatus;