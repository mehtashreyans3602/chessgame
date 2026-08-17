import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [boardState, setBoardState] = useState({});
    const [currentPlayer, setCurrentPlayer] = useState('B'); // B, G, or R
    const [highlightedMoves, setHighlightedMoves] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);


    const updateBoardState = (newBoard) => {
        setBoardState(newBoard);
    };



    const updateCurrentPlayer = (player) => {
        setCurrentPlayer(player);
    };

    const updateHighlightedMoves = (moves) => {
        setHighlightedMoves(moves);
    };

    const selectPiece = (polygonId) => {
        setSelectedPiece(polygonId);
    };

    const clearSelection = () => {
        setSelectedPiece(null);
        setHighlightedMoves([]);
    };

    const endGame = (winnerColor) => {
        setGameOver(true);
        setWinner(winnerColor);
    };

    const resetGame = () => {
        setBoardState({});
        setCurrentPlayer('B');
        setHighlightedMoves([]);
        setSelectedPiece(null);
        setGameOver(false);
        setWinner(null);

    };

    return (
        <GameContext.Provider
            value={{
                boardState,
                currentPlayer,
                highlightedMoves,
                selectedPiece,
                gameOver,
                winner,

                updateBoardState,
                updateCurrentPlayer,
                updateHighlightedMoves,
                selectPiece,
                clearSelection,
                endGame,
                resetGame,

            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within GameProvider');
    }
    return context;
};