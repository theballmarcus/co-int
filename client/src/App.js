import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login'
import Layout from './Layout';
import DescribeUser from './pages/DescribeUser';
import Profile from './pages/Profile';
import FindFriends from './pages/FindFriends';
import Friends from './pages/Friends';

function App() {
    const { isLoggedIn } = useAuth(); 
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
                    <Route path="/describe-user" element={isLoggedIn ? <DescribeUser /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/find-friends" element={isLoggedIn ? <FindFriends /> : <Navigate to="/login" />} />
                    <Route path="/friends" element={isLoggedIn ? <Friends /> : <Navigate to="/login" />} />

                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
