import apiClient from './config'

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post('/api/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post('/api/users/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateProfile = async (updateData) => {
    try {
        const response = await apiClient.patch('/api/users/profile', updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        localStorage.removeItem('authToken');
        return true;
    }
    return false;
};

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get('/api/users/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


