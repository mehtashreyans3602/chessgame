import { useState } from 'react';
import { usePlayerContext } from '../context/PlayerContext';

export const usePlayerManagement = () => {
    const { players, updatePlayer, clearPlayers, areAllPlayersSet } = usePlayerContext();
    const [errors, setErrors] = useState({
        Blue: '',
        Green: '',
        Red: '',
    });

    const validatePlayerName = (name) => {
        if (!name || name.trim() === '') {
            return 'Player name is required';
        }
        if (name.length < 2) {
            return 'Name must be at least 2 characters';
        }
        if (name.length > 20) {
            return 'Name must be less than 20 characters';
        }
        return '';
    };

    const handlePlayerChange = (color, name) => {
        updatePlayer(color, name);
        const error = validatePlayerName(name);
        setErrors((prev) => ({
            ...prev,
            [color]: error,
        }));
    };

    const hasErrors = () => {
        return Object.values(errors).some((error) => error !== '');
    };

    const canStartGame = () => {
        return areAllPlayersSet() && !hasErrors();
    };

    return {
        players,
        errors,
        handlePlayerChange,
        clearPlayers,
        canStartGame,
    };
};