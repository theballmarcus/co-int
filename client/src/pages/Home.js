import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';

const Home = () => {
    const { isLoggedIn, gamertag } = useAuth();

    return (
        <Box
            // sx={{
            //     display: 'flex',
            //     flexDirection: 'column',
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //     padding: '20px',
            // }}
        >
            {isLoggedIn ? (
                <>
                    <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                        Home
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: '20px', color: "#FFF" }}>
                        Welcome to the home page, you are logged in as {gamertag}.
                    </Typography>
                    <nav className="login_content">

                    </nav>
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
