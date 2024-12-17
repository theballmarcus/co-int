import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, heartBeat} from './api';

const AuthContext = createContext();

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
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const friends = localStorage.getItem('friends');
        const description = localStorage.getItem('description');
        const gamertag = localStorage.getItem('gamertag');
        const age = localStorage.getItem('age');
        const email = localStorage.getItem('email');
        const tags = localStorage.getItem('tags');
        const userId = localStorage.getItem('userId');
        
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
        if (userId) setUserId(JSON.parse(userId));
    }, []);

    const login = async (email, password) => {
        try {
            const response = await loginUser({ email, password });
            if (response.ok) {
                const data = response;
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('friends', JSON.stringify(data.friends)); 
                if(data.description != null || data.description !== undefined)
                    localStorage.setItem('description', JSON.stringify(data.description)); 
                localStorage.setItem('gamertag', JSON.stringify(data.gamertag)); 
                localStorage.setItem('age', JSON.stringify(data.age)); 
                localStorage.setItem('email', JSON.stringify(data.email)); 
                localStorage.setItem('tags', JSON.stringify(data.tags)); 
                localStorage.setItem('userId', JSON.stringify(data.userId)); 

                setIsLoggedIn(true);
                setToken(data.token);
                setFriends(data.friends);
                if(data.description != null || data.description !== undefined) {
                    setDescription(data.description);
                    console.log('Description:', data.description);
                }

                setGamertag(data.gamertag);
                setAge(data.age);
                setEmail(data.email);
                setTags(data.tags);
                setUserId(data.userId);

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
        localStorage.removeItem('friends');
        localStorage.removeItem('description');
        localStorage.removeItem('gamertag');
        localStorage.removeItem('age');
        localStorage.removeItem('email');
        localStorage.removeItem('tags');
        
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        setFriends(null);
        setDescription(null);
        setGamertag(null);
        setAge(null);
        setEmail(null);
        setTags([]);
        setUserId(null);
    };

    const value = {
        isLoggedIn,
        user,
        token,
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
        userId,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
