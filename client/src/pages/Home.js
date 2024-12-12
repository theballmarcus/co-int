import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';
import '../css/Homepage.css';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


const Home = () => {
    const { isLoggedIn, gamertag, tags } = useAuth();

    // On tags load, console log
    React.useEffect(() => {
        console.log('Tags:', tags);
    }, [tags]);

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
                                    Find match
                                </Typography>
                                <Button className='find-friends-button' sx={{
                                    backgroundColor: '#46B1E1',
                                    color: '#646464',
                                    borderRadius: '10px',
                                    width: '200px',
                                    height: '50px',
                                    fontSize: '20px',
                                    marginLeft: '40px',
                                }}>Find Friends</Button>
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
                        <div className='notifications-container'>
                            <Typography variant="h4" sx={{ 
                                marginBottom: '20px',
                                marginTop: '20px',
                                }}>
                                Notifications
                            </Typography>
                            <div className='notification-divider'></div>
                            <div className='notifications'></div>
                            <div className='notification-divider'></div>
                            
                            <Typography variant="h4" sx={{ 
                                marginBottom: '20px',
                                marginTop: '20px',
                                }}>
                                n new messages.
                            </Typography>
                            </div>
                    </div>
                </>
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center', // Height should be 100vh - header
                            height: 'calc(100vh - 400px)', // Subtract the height of the header
                            width: '100%',
                            position: 'relative', // For positioning the buttons absolutely inside the container
                            padding: '20px 0',
                        }}
                    >
                        <Link
                            to="/register"
                            style={{ textDecoration: 'none', position: 'absolute', left: '230px' }} // Remove the underline from Link and position the button
                        >
                            <Button
                                sx={{
                                    backgroundColor: '#404040',
                                    color: '#646464',
                                    borderRadius: '10px', // Slightly less rounded corners
                                    position: 'absolute',
                                    width: '500px', // Set the width of the button
                                    height: '200px', // Set the height of the button
                                    padding: '0', // Remove default padding
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
