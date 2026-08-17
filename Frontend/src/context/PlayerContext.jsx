import React, { createContext, useState, useContext, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [players, setPlayers] = useState({
        Blue: localStorage.getItem('Blue') || '',
        Green: localStorage.getItem('Green') || '',
        Red: localStorage.getItem('Red') || '',
    });

    // Sync with localStorage whenever players change
    useEffect(() => {
        localStorage.setItem('Blue', players.Blue);
        localStorage.setItem('Green', players.Green);
        localStorage.setItem('Red', players.Red);
    }, [players]);

    const updatePlayer = (color, name) => {
        setPlayers((prev) => ({
            ...prev,
            [color]: name,
        }));
    };

    const clearPlayers = () => {
        setPlayers({ Blue: '', Green: '', Red: '' });
        localStorage.removeItem('Blue');
        localStorage.removeItem('Green');
        localStorage.removeItem('Red');
    };

    const areAllPlayersSet = () => {
        return players.Blue && players.Green && players.Red;
    };

    return (
        <PlayerContext.Provider
            value={{
                players,
                updatePlayer,
                clearPlayers,
                areAllPlayersSet,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayerContext must be used within PlayerProvider');
    }
    return context;
};