import React from 'react';
import styles from './Button.module.css';

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'danger'
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
                    children,
                    onClick,
                    variant = 'primary',
                    disabled = false,
                    type = 'button',
                    size = 'medium',
                    className = '',
                    ...rest
                }) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        disabled ? styles.disabled : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;