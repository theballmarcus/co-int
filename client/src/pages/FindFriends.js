import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { findMatches, getUser, addFriend } from '../api';
import { getRandomColor } from './Home';
import { Link } from 'react-router-dom';
import NotificationBox from './components/NotificationBox';
import '../css/FindFriends.css';

const FindFriends = () => {
    const { isLoggedIn, userId, tags, token, gamertag } = useAuth();
    const [ craftedMatches, setCraftedMatches ] = React.useState([]);
    const [isAdded, setIsAdded] = React.useState([]);

    const findMatchesLocal = async (token) => {
        if (!isLoggedIn) {
            return;
        }
        try {
            const matches = await findMatches(token);
            const craftedMatchPromises = matches.match.map(async (match) => {
                const user = await getUser(match);
                return {
                    gamertag: user.gamertag,
                    tags: user.tags,
                    age: user.age,
                    userId: user.userId,
                };
            });
    
            const resolvedCraftedMatches = await Promise.all(craftedMatchPromises);
            setCraftedMatches([...resolvedCraftedMatches]);

        } catch (error) {
            console.error('Error finding matches:', error);
        }
    };

    const handleAdd = async (userId) => {
        await addFriend(token, userId);
        setIsAdded([...isAdded, userId]);
        console.log('Added:', isAdded);
        return;
    }

    return (
        <Box>
            {isLoggedIn ? (
                <>
                    <div className='page-content'>
                        <div className='info-container'>
                            <Typography variant="h4" className="primary-heading">
                                Find new friends
                            </Typography>
                            <div className='find-match-container'>
                                <Typography variant="body1" sx={{ 
                                    marginBottom: '20px', 
                                    color: "#b3b3b3",
                                    fontSize: '30px',
                                    }}>
                                    Find a match 
                                </Typography>
                                <Button
                                    sx={{
                                        backgroundColor: '#46B1E1',
                                        color: '#646464',
                                        borderRadius: '10px',
                                        width: '200px',
                                        height: '50px',
                                        padding: '0',
                                        fontSize: '20px',
                                        marginLeft: '20px',
                                    }}
                                    onClick={() => findMatchesLocal(token)}
                                >
                                    Find
                                </Button>
                            </div>

                            <div className='found-matches-container'>
                                <div className="scrollable-matches">
                                
                                    {craftedMatches.map((match, index) => (
                                        <div className='found-match' key={index}>
                                            <div className="match-content">
                                                <img 
                                                    src={`http://localhost:5000/uploads/profile-pics/${match.userId}.jpg`} 
                                                    alt="Profile"
                                                    className="profile-picture"
                                                />
                                                <div className="match-details">
                                                    <Typography 
                                                        variant="h5" 
                                                        sx={{ marginBottom: '10px' }}
                                                    >
                                                        {match.gamertag}
                                                    </Typography>
                                                    <div className="found-match-tags">
                                                        {match.tags.map((tag, tagIndex) => (
                                                            <div 
                                                                className="tag" 
                                                                key={tagIndex} 
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
                                                {isAdded.includes(match.userId) ? (
                                                    <div className="checkmark">
                                                        ✓
                                                    </div>
                                                ) : (
                                                    <button 
                                                        className="add-button"
                                                        onClick={async () => {
                                                            await handleAdd(match.userId)
                                                        }}
                                                    >
                                                        Add
                                                    </button>
                                                )}

                                            </div>
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
}

export default FindFriends;