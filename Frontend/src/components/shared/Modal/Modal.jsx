import React, { useEffect } from 'react';
import styles from './Modal.module.css';

/**
 * Reusable Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Function to call when modal should close
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {boolean} props.showCloseButton - Show X button in top right
 * @param {boolean} props.closeOnOverlayClick - Close modal when clicking outside
 * @param {boolean} props.closeOnEscape - Close modal on Escape key
 * @param {string} props.size - Modal size: 'small', 'medium', 'large'
 */
const Modal = ({
                   isOpen,
                   onClose,
                   children,
                   title,
                   showCloseButton = true,
                   closeOnOverlayClick = true,
                   closeOnEscape = true,
                   size = 'medium',
               }) => {
    // Handle Escape key press
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={`${styles.modal} ${styles[size]}`}>
                {/* Modal Header */}
                <div className={styles.header}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    {showCloseButton && (
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Modal Content */}
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;