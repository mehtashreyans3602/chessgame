import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../shared/Modal/Modal';
import Button from '../../shared/Button/Button';
import { usePlayerContext } from '../../../context/PlayerContext';
import { COLOR_MAP } from '../../../utils/constants';
import styles from './GameOverModal.module.css';

/**
 * Game Over Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {string} props.winner - Winner color code ('R', 'G', 'B')
 * @param {Function} props.onClose - Close modal handler
 */
const GameOverModal = ({ isOpen, winner, onClose }) => {
    const navigate = useNavigate();
    const { players } = usePlayerContext();

    const colorName = COLOR_MAP[winner] || 'Unknown';
    const winnerName = players[colorName] || 'Unknown';
    const colorClass = colorName ? colorName.toLowerCase() : 'unknown';

    const handleNewGame = () => {
        onClose(); // Reset game state first
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Game Over"
            size="small"
            closeOnOverlayClick={false}
            closeOnEscape={false}
        >
            <div className={styles.content}>
                <div className={styles.winnerDisplay}>
          <span className={`${styles.crown} ${styles[colorClass]}`}>
            👑
          </span>
                    <h3 className={styles.winnerText}>
                        {winnerName}
                        <span className={`${styles.colorBadge} ${styles[colorClass]}`}>
              ({colorName})
            </span>
                    </h3>
                    <p className={styles.message}>has won the game!</p>
                </div>

                <div className={styles.actions}>
                    <Button variant="primary" onClick={handleNewGame} size="large">
                        New Game
                    </Button>
                    <Button variant="secondary" onClick={onClose} size="large">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default GameOverModal;