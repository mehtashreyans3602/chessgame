import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
    const { currentTheme, changeTheme, themes } = useThemeContext();

    const getThemeClass = () => currentTheme;

    const isThemeActive = (theme) => currentTheme === theme;

    return {
        currentTheme,
        changeTheme,
        getThemeClass,
        isThemeActive,
        availableThemes: themes,
    };
};