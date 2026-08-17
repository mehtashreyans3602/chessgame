import React from 'react';
import styles from './PlayerInput.module.css';

/**
 * Individual Player Input Component
 * @param {Object} props
 * @param {string} props.color - Player color: 'Blue', 'Green', 'Red'
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 */
const PlayerInput = ({ color, value, onChange, error, placeholder }) => {
    const handleChange = (e) => {
        onChange(color, e.target.value);
    };

    const getKingImage = () => {
        const colorMap = { 'Blue': 'blue', 'Green': 'green', 'Red': 'red' };
        const colorCode = colorMap[color];
        if (!colorCode) return null;

        try {
            return require(`../../../assets/pieces/king-${colorCode}.svg`);
        } catch (error) {
            return null;
        }
    };

    const kingImage = getKingImage();

    return (
        <div className={styles.inputContainer}>
            <label htmlFor={`player-${color}`} className={styles.label}>
                {color} Player
            </label>
            <div className={styles.inputWrapper}>
                <input
                    id={`player-${color}`}
                    type="text"
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder || `Enter ${color} player name`}
                    maxLength={20}
                />
                {kingImage ? (
                    <img
                        src={kingImage}
                        alt={`${color} King`}
                        className={styles.kingIcon}
                    />
                ) : (
                    <span className={`${styles.kingIcon} ${styles[color.toLowerCase()]}`}>
                        ♔
                    </span>
                )}
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default PlayerInput;