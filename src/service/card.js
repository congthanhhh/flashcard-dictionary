import apiClient from './config'

// ===== CARD MANAGEMENT =====

// Get single card (cần auth)
export const getCardById = async (cardId) => {
    try {
        const response = await apiClient.get(`api/cards/${cardId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Add card to deck (cần auth)
export const addCardToDeck = async (deckId, cardData) => {
    try {
        const response = await apiClient.post(`api/decks/${deckId}/cards`, cardData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update card (cần auth)
export const updateCard = async (cardId, cardData) => {
    try {
        const response = await apiClient.patch(`api/cards/${cardId}`, cardData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Delete card (cần auth)
export const deleteCard = async (cardId) => {
    try {
        const response = await apiClient.delete(`api/cards/${cardId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Search cards (cần auth)
export const searchCards = async (searchParams, page = 1, limit = 20) => {
    try {
        const response = await apiClient.get('api/cards/search', {
            params: { ...searchParams, page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Submit card review (cần auth)
export const submitCardReview = async (cardId, reviewData) => {
    try {
        const response = await apiClient.post(`api/cards/${cardId}/review`, reviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

