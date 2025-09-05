import apiClient from './config'


export const getDefaultDecks = async (page = 1, limit = 12) => {
    try {
        const response = await apiClient.get('api/default-decks', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get single default deck
export const getDefaultDeckId = async (deckId) => {
    try {
        const response = await apiClient.get(`api/default-decks/${deckId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get cards from default deck
export const getDefaultDeckCards = async (deckId, page = 1, limit = 20) => {
    try {
        const response = await apiClient.get(`api/default-decks/${deckId}/cards`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Clone default deck to personal deck (cần auth)
export const cloneDefaultDeck = async (deckId) => {
    try {
        const response = await apiClient.post(`api/default-decks/${deckId}/cards`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// ===== USER PERSONAL DECKS =====

// Get all user decks (cần auth)
export const getUserDecks = async (page = 1, limit = 12) => {
    try {
        const response = await apiClient.get('api/decks', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get single user deck (cần auth)
export const getUserDeckById = async (deckId) => {
    try {
        const response = await apiClient.get(`api/decks/${deckId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get cards from user deck (cần auth)
export const getUserDeckCards = async (deckId, page = 1, limit = 20) => {
    try {
        const response = await apiClient.get(`api/decks/${deckId}/cards`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Create new deck (cần auth)
export const createUserDeck = async (deckData) => {
    try {
        const response = await apiClient.post('api/decks', deckData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update deck (cần auth)
export const updateUserDeck = async (deckId, deckData) => {
    try {
        const response = await apiClient.patch(`api/decks/${deckId}`, deckData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete deck (cần auth)
export const deleteUserDeck = async (deckId) => {
    try {
        const response = await apiClient.delete(`api/decks/${deckId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};