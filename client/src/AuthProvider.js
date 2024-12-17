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
        const tokenCook = localStorage.getItem('authToken');
        const friendsCook = localStorage.getItem('friends');
        const descriptionCook = localStorage.getItem('description');
        const gamertagCook = localStorage.getItem('gamertag');
        const ageCook = localStorage.getItem('age');
        const emailCook = localStorage.getItem('email');
        const tagsCook = localStorage.getItem('tags');
        const userIdCook = localStorage.getItem('userId');
        
        if (tokenCook && (token !== '' || token !== null)) {
            setIsLoggedIn(true);
            setToken(token);
        }
    
        if (friendsCook) setFriends(JSON.parse(friends));
        if (descriptionCook) setDescription(JSON.parse(description));
        if (gamertagCook) setGamertag(JSON.parse(gamertag));
        if (ageCook) setAge(JSON.parse(age));
        if (emailCook) setEmail(JSON.parse(email));
        if (tagsCook) setTags(JSON.parse(tags));
        if (userIdCook) setUserId(JSON.parse(userId));
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
        localStorage.removeItem('userId');
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
