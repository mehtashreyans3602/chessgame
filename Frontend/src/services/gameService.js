import apiClient from './api';

/**
 * Service layer for all game-related API calls
 */
const gameService = {
    /**
     * Start a new game session
     * @returns {Promise<void>}
     */
    newGame: async () => {
        try {
            const response = await apiClient.get('/newGame');
            return response.data;
        } catch (error) {
            console.error('Error starting new game:', error);
            throw error;
        }
    },

    /**
     * Send polygon click event to backend
     * @param {string} polygonId - The polygon ID (e.g., "Ba1", "Rg3")
     * @returns {Promise<Object>} GameState with board, highlightedPolygons, winner, gameOver
     */
    sendClick: async (polygonId) => {
        try {
            const response = await apiClient.post('/onClick', polygonId, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error sending click:', error);
            throw error;
        }
    },

    /**
     * Get current player's turn
     * @returns {Promise<string>} Color character ('R', 'G', 'B')
     */
    getCurrentPlayer: async () => {
        try {
            const response = await apiClient.get('/currentPlayer');
            return response.data;
        } catch (error) {
            console.error('Error getting current player:', error);
            throw error;
        }
    },

    /**
     * Get current board state
     * @returns {Promise<Object>} Board map {polygonId: pieceCode}
     */
    getBoard: async () => {
        try {
            const response = await apiClient.get('/board');
            return response.data;
        } catch (error) {
            console.error('Error getting board:', error);
            throw error;
        }
    },
};

export default gameService;