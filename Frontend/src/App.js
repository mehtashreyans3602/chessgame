import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage/LandingPage';
import GamePage from './pages/GamePage/GamePage';
import './App.css';

function App() {
    return (
        <Router>
            <PlayerProvider>
                <GameProvider>
                    <ThemeProvider>
                        <div className="app">
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/game" element={<GamePage />} />
                            </Routes>
                        </div>
                    </ThemeProvider>
                </GameProvider>
            </PlayerProvider>
        </Router>
    );
}

export default App;