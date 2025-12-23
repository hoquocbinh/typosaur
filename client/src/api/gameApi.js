const BASE_URL = 'http://localhost:59096/api'; // Adjust port if needed

export const gameApi = {
    /**
     * Starts a new game session
     * @param {string} playerName 
     */
    startGame: async (playerName = 'Guest') => {
        const res = await fetch(`${BASE_URL}/game/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName }),
        });
        if (!res.ok) throw new Error('Failed to start game');
        return res.json();
    },

    /**
     * Sends a batch of typing events
     * @param {string} sessionId 
     * @param {Array<{char: string, timestamp: number}>} events 
     */
    sendBatch: async (sessionId, events) => {
        const res = await fetch(`${BASE_URL}/game/type-batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, events }),
        });
        if (!res.ok) throw new Error('Batch failed');
        return res.json();
    },

    /**
     * Ends the game
     * @param {string} sessionId 
     */
    endGame: async (sessionId) => {
        const res = await fetch(`${BASE_URL}/game/end`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) throw new Error('Failed to end game');
        return res.json();
    },

    /**
     * Get Leaderboard
     */
    getLeaderboard: async (top = 10) => {
        const res = await fetch(`${BASE_URL}/leaderboard?top=${top}`);
        if (!res.ok) throw new Error('Failed to load leaderboard');
        return res.json();
    }
};
