import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from './api';
import { set } from 'mongoose';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); 
    const [friends, setFriends] = useState(null);
    const [description, setDescription] = useState(null);
    const [gamertag, setGamertag] = useState(null);
    const [age, setAge] = useState(null);
    const [email, setEmail] = useState(null);
    const [tags, setTags] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
            
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginUser({ email, password });
            if (response.ok) {
                const data = response;
                localStorage.setItem('authToken', data.token);
                setIsLoggedIn(true);
                setUser(data.user); 
                setFriends(data.friends);
                setDescription(data.description);
                setGamertag(data.gamertag);
                setAge(data.age);
                setEmail(data.email);
                setTags(data.tags);
                return response;
            } else {
                console.error('Login failed:', response);
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUser(null);
    };

    const value = {
        isLoggedIn,
        user,
        login,
        logout,
        friends,
        description,
        setDescription,
        gamertag,
        age,
        email,
        tags,        
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
