import { useState, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import gameService from '../services/gameService';
import { soundManager } from '../utils/sounds';

export const useGameState = () => {
    const {
        boardState,
        currentPlayer,
        highlightedMoves,
        selectedPiece,
        updateBoardState,
        updateCurrentPlayer,
        updateHighlightedMoves,
        selectPiece,
        clearSelection,
        endGame,

    } = useGameContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize game
    const initializeGame = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await gameService.newGame();
            const board = await gameService.getBoard();
            const player = await gameService.getCurrentPlayer();

            updateBoardState(board);
            updateCurrentPlayer(player);
            clearSelection();
        } catch (err) {
            setError('Failed to initialize game');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [updateBoardState, updateCurrentPlayer, clearSelection]);

    // Removed automatic loading to prevent proxy errors when backend is down

    // Handle polygon click
    const handlePolygonClick = useCallback(async (polygonId) => {
        console.log('Polygon clicked:', polygonId);
        setLoading(true);
        setError(null);
        try {
            console.log('Sending click to backend...');
            const response = await gameService.sendClick(polygonId);
            console.log('Backend response:', response);

            // Update board state
            console.log('Updating board state:', response.board);

            // Check for captures and play sound effect
            const oldPieces = Object.entries(boardState);
            const newPieces = Object.entries(response.board);
            const wasCapture = oldPieces.length > newPieces.length;

            if (wasCapture) {
                soundManager.playCapture();
            } else {
                soundManager.playMove();
            }

            updateBoardState(response.board);

            // Update highlighted moves
            console.log('Updating highlighted moves:', response.highlightedPolygons);
            updateHighlightedMoves(response.highlightedPolygons || []);

            // Update selected piece
            if (response.highlightedPolygons && response.highlightedPolygons.length > 0) {
                selectPiece(polygonId);
            } else {
                clearSelection();
            }

            // Check for game over
            if (response.gameOver) {
                endGame(response.winner);
            } else {
                // Update current player
                const player = await gameService.getCurrentPlayer();
                updateCurrentPlayer(player);
            }

            return response;
        } catch (err) {
            console.error('Error in handlePolygonClick:', err);
            setError('Failed to process move');
            return null;
        } finally {
            setLoading(false);
        }
    }, [updateBoardState, updateHighlightedMoves, selectPiece, clearSelection, updateCurrentPlayer, endGame, boardState]);

    return {
        boardState,
        currentPlayer,
        highlightedMoves,
        selectedPiece,
        loading,
        error,
        initializeGame,
        handlePolygonClick,
    };
};