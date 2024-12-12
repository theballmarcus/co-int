import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; 

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const describeUser = async (description) => {
    try {
        const response = await fetch(`${API_BASE_URL}/describe-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error describing user:', error);
        throw error;
    }
};

export const heartBeat = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/heartbeat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
        });
        const data = response.json()
        console.log('Heartbeat response:', data)

    } catch (error) {
        console.error('Heartbeat error:', error)
    }
}

// export const findMatch = (userId) => API.post('/match', { userId });
