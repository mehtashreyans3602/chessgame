import React from 'react';
import PlayerInput from '../PlayerInput/PlayerInput';
import Button from '../../common/Button/Button';
import { usePlayerManagement } from '../../../hooks/usePlayerManagement';
import styles from './PlayerForm.module.css';

/**
 * Player Form Component - Handles all three player inputs
 * @param {Object} props
 * @param {Function} props.onStartGame - Callback when game starts
 */
const PlayerForm = ({ onStartGame }) => {
    const { players, errors, handlePlayerChange, canStartGame } = usePlayerManagement();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (canStartGame()) {
            onStartGame();
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <PlayerInput
                color="Blue"
                value={players.Blue}
                onChange={handlePlayerChange}
                error={errors.Blue}
                placeholder="Player 1"
            />

            <PlayerInput
                color="Green"
                value={players.Green}
                onChange={handlePlayerChange}
                error={errors.Green}
                placeholder="Player 2"
            />

            <PlayerInput
                color="Red"
                value={players.Red}
                onChange={handlePlayerChange}
                error={errors.Red}
                placeholder="Player 3"
            />

            <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={!canStartGame()}
                className={styles.startButton}
            >
                New Game
            </Button>
        </form>
    );
};

export default PlayerForm;