import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';
import '../css/Profile.css';
import { updateProfilePic, postDiscordTag } from '../api';
import { getRandomColor } from './Home';
import NotificationBox from './components/NotificationBox';

const DiscordTag = () => {
    const [discordTag, setDiscordTag] = React.useState('');
    const { token } = useAuth();
    const handleSave = () => {
        postDiscordTag(token, discordTag);
    }

    return (
        <Box sx={{ padding: '10px', backgroundColor: '#404040', borderRadius: '8px', boxShadow: 2 }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    marginBottom: '20px', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: '#fff',
                }}
            >
                Discord Tag
            </Typography>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '20px', 
                    alignItems: 'center' 
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Enter Discord Tag"
                    fullWidth
                    sx={{
                        maxWidth: '400px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        '& .MuiInputBase-root': {
                            borderRadius: '8px',
                            padding: '10px',
                        },
                    }}
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        width: '150px',
                        padding: '10px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: '#0069d9', 
                        }
                    }}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
};

const Profile = () => {
    const { isLoggedIn, gamertag, tags, email, token, userId } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [profilePictureUrl, setProfilePicture] = React.useState(null);

    React.useEffect(() => {
        if (userId) {
            setProfilePicture(`${process.env.REACT_APP_API_BASE_URL}/uploads/profile-pics/${userId}.jpg`);
        } else {
            console.log('User ID not found');
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
                            <div className='profile-heading-container'>
                                <div className="profile-picture-container">
                                    <img 
                                        src={profilePictureUrl || defaultProfilePic} 
                                        alt="Profile"
                                        className="profile-profile-picture"
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
                            <div className='profile-tags-container'>
                                <Typography variant="h4" sx={{ 
                                    marginBottom: '20px',
                                    marginTop: '20px',
                                    }}>
                                    {gamertag}'s Tags
                                </Typography>
                                <div className='profile-tags'>
                                    {tags.map((tag, index) => (
                                        <div 
                                            className='tag' 
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
                            <div style={{marginLeft: '50px', marginTop: '20px'}} >
                                <DiscordTag />
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

export default Profile;
