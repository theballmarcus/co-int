import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';
import '../css/Homepage.css';
import NotificationBox from './components/NotificationBox';

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const Home = () => {
    const { isLoggedIn, gamertag, tags, token } = useAuth();

    return (
        <Box>
            {isLoggedIn ? (
                <>
                    <div className='page-content'>
                        <div className='info-container'>
                            <Typography variant="h4" className="primary-heading">
                                Common Interest
                            </Typography>
                            <div className='find-match-container'>
                                <Typography variant="body1" sx={{ 
                                        marginBottom: '20px', 
                                        color: "#b3b3b3",
                                        fontSize: '30px',
                                    }}>
                                    Find matches
                                </Typography>
                                <Link to="/find-friends">
                                    <Button className='find-friends-button' sx={{
                                        backgroundColor: '#46B1E1',
                                        color: '#646464',
                                        borderRadius: '10px',
                                        width: '200px',
                                        height: '50px',
                                        fontSize: '20px',
                                        marginLeft: '40px',
                                    }}>Find Friends</Button>
                                </Link>
                            </div>

                            <div className="user-tags-container">
                                <Typography variant="body1" sx={{ 
                                    marginTop: '20px', 
                                    color: "#b3b3b3",
                                    fontSize: '30px',
                                }}>
                                    {gamertag}'s Tags
                                </Typography>
                                <div className="user-tags">
                                    {console.log(tags.length)}
                                    {tags.length === 0 ? (
                                            <> 
                                                <div 
                                                    className="tag" 
                                                    style={{
                                                        backgroundColor: getRandomColor(),
                                                        padding: '10px 20px',
                                                        margin: '5px',
                                                        borderRadius: '15px',
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    <h1 style={{ margin: 0, fontSize: '18px' }}>You have no tags yet, go to describe user page.</h1>
                                                </div>
                                            </>) : (
                                            <>
                                            </>
                                            )
                                    }
                                    {tags.map((tag, index) => (
                                        <div 
                                            className="tag" 
                                            key={index} 
                                            style={{
                                                backgroundColor: getRandomColor(),
                                                padding: '10px 20px',
                                                margin: '5px',
                                                borderRadius: '15px',
                                                display: 'inline-block',
                                            }}
                                        >
                                            <h1 style={{ margin: 0, fontSize: '18px' }}>{tag}</h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <NotificationBox token={token} />
                    </div>
                </>
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center', 
                            height: 'calc(100vh - 400px)',
                            width: '100%',
                            position: 'relative',
                            padding: '20px 0',
                        }}
                    >
                        <Link
                            to="/register"
                            style={{ textDecoration: 'none', position: 'absolute', left: '230px' }} 
                        >
                            <Button
                                sx={{
                                    backgroundColor: '#404040',
                                    color: '#646464',
                                    borderRadius: '10px', 
                                    position: 'absolute',
                                    width: '500px', 
                                    height: '200px', 
                                    padding: '0',
                                    fontSize: '30px',
                                }}
                            >
                                Register
                            </Button>
                        </Link>
                        <Link
                            to="/login"
                            style={{ textDecoration: 'none', position: 'absolute', left: '930px' }}
                        >
                            <Button
                                sx={{
                                    backgroundColor: '#404040',
                                    color: '#646464',
                                    borderRadius: '10px',
                                    position: 'absolute',
                                    width: '500px', 
                                    height: '200px', 
                                    padding: '0',
                                    fontSize: '30px',
                                }}
                            >
                                Login
                            </Button>
                        </Link>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Home;
