import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000'; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);

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

export const updateProfilePic = async (token, file) => {
    const formData = new FormData();
    formData.append('profilePic', file); 
    
    try {
        const response = await fetch(`${API_BASE_URL}/post-profile-pic`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Profile picture uploaded:', data);
        } else {
            console.error('Error uploading profile picture');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export const getUser = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export const findMatches = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/find-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error getting matches:', error);
        throw error;
    }
}

export const addFriend = async (token, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/add-friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ friendId: userId }),
        });

        if (!response.ok) {
            if (response.status === 409) {
                return { error: 'User is already your friend' };
            }
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    }
    catch (error) {
        console.error('Error adding friend:', error);
        throw error;
    }
};

export const getFriends = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const friends = await response.json().then(data => {
            return data.friends
        })
        return await friends;
    }
    catch (error) {
        console.error('Error getting friends:', error);
        throw error;
    }
}

export const getNotifications = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json()
    }
    catch (error) {
        console.error('Error getting notifications:', error);
        throw error;
    }

}

export const postDiscordTag = async (token, discordTag) => {
    try {
        const response = await fetch(`${API_BASE_URL}/set-discord-tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ discordTag }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    }
    catch (error) {
        console.error('Error setting Discord tag:', error);
        throw error;
    }
}