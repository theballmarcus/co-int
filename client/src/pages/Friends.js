import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { getFriends } from '../api';
import NotificationBox from './components/NotificationBox';

const Friends = () => {
    const { token } = useAuth();
    const [friends, setFriends] = React.useState([]); 
    const [error, setError] = React.useState(null);

    const getFriendStatus = (friend) => {
        return friend.isOnline ? 'online' : 'offline';
    };

    React.useEffect(() => {
        const fetchFriends = async () => {
            try {
                const myFriends = await getFriends(token);
                if (Array.isArray(myFriends)) {
                    setFriends(myFriends);
                } else {
                    setError('Unexpected response format');
                }
            } catch (error) {
                setError('Error fetching friends');
                console.error(error);
            }
        };

        if (token) {
            fetchFriends();
        }
    }, [token]);

    return (
        <Box sx={{ padding: '20px' }}>
            <div className="page-content">
                <div className="info-container">
                    <Typography variant="h4" className="primary-heading">
                        Friends
                    </Typography>
                    <div className="friends-container">
                        <Typography variant="body1" sx={{ 
                            marginTop: '20px', 
                            color: "#b3b3b3",
                            fontSize: '24px', 
                        }}>
                            Your Discord tag's of your friends
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: { xs: '60px', sm: '60px', md: '150px' },
                            marginTop: '20px' 
                        }}>
                            {error ? (
                                <Typography variant="body1" color="error" sx={{ width: '100%', textAlign: 'center', fontSize: '18px' }}>
                                    {error}
                                </Typography>
                            ) : (
                                friends.length === 0 ? (
                                    <Typography variant="body1" sx={{ width: '100%', textAlign: 'center', fontSize: '18px', color: '#FFF'}}>
                                        You have no friends yet.
                                    </Typography>
                                ) : (
                                    friends.map((friend, index) => {
                                        const isOnline = getFriendStatus(friend);
                                        const borderColor = isOnline === 'online' ? 'green' : 'red';

                                        return (
                                            <Box key={index} sx={{ 
                                                width: { xs: '100%', sm: '48%', md: '23%' }, 
                                                display: 'flex', 
                                                justifyContent: 'center' 
                                            }}>
                                                <Paper sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between',
                                                    padding: '10px',
                                                    border: `2px solid ${borderColor}`,
                                                    borderRadius: '8px',
                                                    boxShadow: 2,  
                                                    backgroundColor: '#b3b3b3', 
                                                    width: '50px',
                                                    height: '50px',
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <img 
                                                            src={`${process.env.REACT_APP_API_BASE_URL}/uploads/profile-pics/${friend.userId}.jpg`}
                                                            alt={`${friend.gamertag}'s profile`} 
                                                            style={{ 
                                                                width: '50px', 
                                                                height: '50px', 
                                                                borderRadius: '50%',
                                                                marginRight: '15px',
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: isOnline === 'online' ? 'green' : 'red', 
                                                            fontSize: '25px',
                                                            fontStyle: 'italic',
                                                            marginLeft: '15px',
                                                        }}
                                                    >
                                                        {friend.discord ? (friend.discord) : (< >friend.gamertag (No tag supplied)</>)}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        );
                                    })
                                )
                            )}
                        </Box>
                    </div>
                </div>
                <NotificationBox token={token} />
            </div>
        </Box>
    );
};

export default Friends;
