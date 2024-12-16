import React from 'react';
import { Link } from 'react-router-dom';
import './css/Layout.css';
import { useAuth } from './AuthProvider';

const Layout = ({ children }) => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <div className="layout">
            <div className="sidebar">
                <nav>
                    <Link to="/">Home</Link>  
                    {isLoggedIn !== true ? <>
                        <Link to="/register">Register Account</Link>
                        <Link to="/login">Login</Link>
                    </> : <>
                        <Link to="/describe-user">Describe User</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/find-friends">Find Friends</Link>
                        <Link to="/friends">Friends</Link>
                    </>}
                </nav>
            </div>

            <div className="content">
                <div className="topbar">
                    <div className="logo-container">
                        <Link to="/">
                            <img src="images/logo.webp" alt="Logo" className="logo" />
                        </Link>
                    </div>
                    
                    <div className="profile-container" onClick={logout}>
                        <img src="images/profile.webp" alt="Profile" className="profile" />
                    </div>
                </div>

                <div className="main-content">
                    {children} 
                </div>
            </div>
        </div>
    );
};

export default Layout;
