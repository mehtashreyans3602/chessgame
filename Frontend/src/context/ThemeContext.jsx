import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const THEMES = {
    ARIAL: 'arialTheme',
    FREE_SERIF: 'freeSerifTheme',
    DEJAVU_SANS: 'dejaVuSansTheme',
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(THEMES.ARIAL);

    const changeTheme = (theme) => {
        if (Object.values(THEMES).includes(theme)) {
            setCurrentTheme(theme);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                currentTheme,
                changeTheme,
                themes: THEMES,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};