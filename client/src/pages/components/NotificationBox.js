import React from 'react';
import { Typography } from '@mui/material';
import { getNotifications } from '../../api';

const NotificationBox = ({ token }) => {
    const [notifications, setNotifications] = React.useState([]);
    const [error, setError] = React.useState(null);
    const hasFetched = React.useRef(false); // Persist the state across renders

    // React.useEffect(() => {
    //     const fetchNotifications = async () => {
    //         console.log('Fetching notifications');
    //         try {
    //             const data = await getNotifications(token);
    //             setNotifications(data.notifications);
    //         } catch (err) {
    //             setError('Failed to load notifications');
    //         }

    //     };
    //     fetchNotifications();
        
    // }, [token]);
    
    React.useEffect(() => {
        const fetchNotifications = async () => {
            console.log('Fetching notifications');
            try {
                const data = await getNotifications(token);
                setNotifications(data.notifications);
            } catch (err) {
                setError('Failed to load notifications');
            }
        };

        if (!hasFetched.current) { // Check if the fetch has already been triggered
            hasFetched.current = true; // Mark as triggered
            fetchNotifications();
        }
    }, [token]); // Dependency array includes only `token` for the first run

    return (
        <div style={{
            position: 'relative',
            right: '200px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#404040',
            width: '450px',
            alignItems: 'center',
            borderRadius: '25px',
            color: '#b3b3b3',
            height: '660px',
            justifyContent: 'space-between',
        }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', marginTop: '10px' }}>
                Notifications
            </Typography>
            
            <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#b3b3b3',
                marginBottom: '20px',
            }}></div>

            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <>
                    <div style={{
                        flex: 1, 
                        marginBottom: '20px',
                        width: '100%',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className="notification-item" style={{ 
                                    marginBottom: '10px',
                                    textAlign: 'center',
                                    }}>
                                    <Typography variant="body1" style={{
                                        color: notification.seen ? '#b3b3b3' : '#46B1E1',
                                    }}>
                                        {notification.content}
                                    </Typography>
                                </div>
                            ))
                        ) : (
                            <Typography variant="body1">No new notifications.</Typography>
                        )}
                    </div>
                </>
            )}

            <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#b3b3b3',
                marginBottom: '30px', 
            }}></div>
            <Typography variant="h5" sx={{ marginBottom: '25px', color: '#46B1E1' }}>
                {notifications.filter(notification => !notification.seen).length} new notifications.
            </Typography>
        </div>
    );
};

export default NotificationBox;
