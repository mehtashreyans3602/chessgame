/**
 * Validate player name
 */
export const validatePlayerName = (name) => {
    if (!name || name.trim() === '') {
        return { isValid: false, error: 'Player name is required' };
    }
    if (name.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters' };
    }
    if (name.length > 20) {
        return { isValid: false, error: 'Name must be less than 20 characters' };
    }
    return { isValid: true, error: '' };
};

/**
 * Validate all player names
 */
export const validateAllPlayers = (players) => {
    const errors = {};
    let isValid = true;

    Object.keys(players).forEach((color) => {
        const result = validatePlayerName(players[color]);
        errors[color] = result.error;
        if (!result.isValid) {
            isValid = false;
        }
    });

    return { isValid, errors };
};