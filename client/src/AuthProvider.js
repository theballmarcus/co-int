import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, heartBeat} from './api';
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
    const [tags, setTags] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const friends = localStorage.getItem('friends');
        const description = localStorage.getItem('description');
        const gamertag = localStorage.getItem('gamertag');
        const age = localStorage.getItem('age');
        const email = localStorage.getItem('email');
        const tags = localStorage.getItem('tags');
    
        if (token) {
            setIsLoggedIn(true);
            setToken(token);
        }
    
        if (friends) setFriends(JSON.parse(friends));
        if (description) setDescription(JSON.parse(description));
        if (gamertag) setGamertag(JSON.parse(gamertag));
        if (age) setAge(JSON.parse(age));
        if (email) setEmail(JSON.parse(email));
        if (tags) setTags(JSON.parse(tags));
        console.log(description, tags)
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginUser({ email, password });
            if (response.ok) {
                const data = response;
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('friends', JSON.stringify(data.friends)); // Save friends list
                localStorage.setItem('description', JSON.stringify(data.description)); // Save user description
                localStorage.setItem('gamertag', JSON.stringify(data.gamertag)); // Save gamertag
                localStorage.setItem('age', JSON.stringify(data.age)); // Save user age
                localStorage.setItem('email', JSON.stringify(data.email)); // Save user email
                localStorage.setItem('tags', JSON.stringify(data.tags)); // Save tags
    
                // Update local component state
                setIsLoggedIn(true);
                setToken(data.token);
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

    useEffect(() => {
        if (token && isLoggedIn) {
            const intervalId = setInterval(() => {            
                heartBeat(token);
            }, 10000);

            return () => clearInterval(intervalId);
        }
    }, [token, isLoggedIn]);

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
        setTags,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
