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

export const getDefaultDeckId = async (deckId) => {
    try {
        const response = await apiClient.get(`api/default-decks/${deckId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

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


// ===== USER PERSONAL DECKS =====

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

export const getUserDeckById = async (deckId) => {
    try {
        const response = await apiClient.get(`api/decks/${deckId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

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

export const createUserDeck = async (deckData) => {
    try {
        const response = await apiClient.post('api/decks', deckData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateUserDeck = async (deckId, deckData) => {
    try {
        const response = await apiClient.patch(`api/decks/${deckId}`, deckData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteUserDeck = async (deckId) => {
    try {
        const response = await apiClient.delete(`api/decks/${deckId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addDefaultCardToPersonalDeck = async (personalDeckId, defaultCardIds) => {
    try {
        const response = await apiClient.post(`api/decks/${personalDeckId}/cards/from-default`, {
            defaultCardId: defaultCardIds
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};



// ===== REVIEW SESSIONS =====
export const createUserDeckReviewSession = async (deckId, sessionConfig) => {
    try {
        const response = await apiClient.post(`api/decks/${deckId}/review-session`, sessionConfig);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createDefaultDeckReviewSession = async (deckId, sessionConfig) => {
    try {
        const response = await apiClient.post(`api/default-decks/${deckId}/review-session`, sessionConfig);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};