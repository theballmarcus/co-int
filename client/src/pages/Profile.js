import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';
import '../css/Profile.css';
import { updateProfilePic } from '../api';

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


const Profile = () => {
    const { isLoggedIn, gamertag, tags, email, token, userId } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [profilePictureUrl, setProfilePicture] = React.useState(null);

    // Get profile picture from the server
    React.useEffect(() => {
        if (userId) {
            setProfilePicture(`http://localhost:5000/uploads/profile-pics/${userId}.jpg`);
        }
    }, [userId]);
    const defaultProfilePic = "https://via.placeholder.com/150?text=No+Image";

    const handleProfilePicClick = () => {
        setIsEditing(true);
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    updateProfilePic(token, file);
                    setProfilePicture(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    React.useEffect(() => {
        console.log('Tags:', tags);
    }, [tags]);

    return (
        <Box>
            {isLoggedIn ? (
                <>
                    <div className="profile-page-content">
                        <div className="profile-info-container">
                            <div className="profile-picture-container">
                                <img 
                                    src={profilePictureUrl || defaultProfilePic} 
                                    alt="Profile"
                                    className="profile-picture"
                                    onClick={handleProfilePicClick}
                                />
                            </div>
                            <div className="profile-text-container">
                                <p className="profile-heading">
                                    {gamertag}'s profile
                                </p>
                                <p className="profile-email">
                                    {email}
                                </p>
                            </div>
                        </div>
                        <div className='description-container'>
                            <Typography variant="h4" sx={{ 
                                marginBottom: '20px',
                                marginTop: '20px',
                                }}>
                                Description
                            </Typography>
                            <div className='description-divider'></div>
                            <div className='description'></div>
                            <div className='description-divider'></div>
                            
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

export default Profile;
