import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerForm from '../../components/landing/PlayerForm/PlayerForm';
import gameService from '../../services/gameService';
import styles from './LandingPage.module.css';

/**
 * Landing Page Component - Entry point for setting up a new game
 */
const LandingPage = () => {
    const navigate = useNavigate();

    const handleStartGame = async () => {
        try {
            // Initialize new game on backend
            await gameService.newGame();

            // Navigate to game page
            navigate('/game');
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Failed to start game. Please make sure the backend server is running.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to 3 Player Chess!</h1>

                <div className={styles.description}>
                    <p>Enter player names to begin your strategic three-way chess battle.</p>
                </div>

                <div className={styles.formContainer}>
                    <PlayerForm onStartGame={handleStartGame} />
                </div>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        A unique twist on classic chess with three players competing simultaneously
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;