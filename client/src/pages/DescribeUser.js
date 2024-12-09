import React, { useState } from 'react';
import { describeUser } from '../api'; 
import { TextField, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';

const DescribeUser = () => {
    const { description, setDescription } = useAuth();
    const [ curDescription, setCurDescription ] = useState(description);


    const handleChange = (e) => {
        setCurDescription(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await describeUser(curDescription);
            setDescription(curDescription);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            {/* Text big textfield */}
            <form onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {curDescription === '' && (
                    <div style={{
                        color: 'white',
                        fontSize: '35px',
                        position: 'absolute',
                        width: '1200px',
                        height: '450px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}>
                        <p style={{
                            color: '#646464'
                        }}>
                            Describe Yourself! Feel free to include things like:<br />
                        </p>
                        <p style={{
                            color: "#FFFFFF"
                        }}>
                            playstyle, favorite games, platforms, gaming style(competitive or casual), playtime, favorite genres, and thoughts on microtransactions.
                        </p>
                        <p style={{
                            color: '#646464'
                        }}>
                            This will help us match you with other players!
                        </p>
                    </div>
                )}
                <textarea
                    placeholder={``}
                    value={curDescription ? curDescription : ''}
                    onChange={handleChange}
                    style={{
                        width: '1200px',
                        height: '450px',
                        fontSize: '20px',
                        backgroundColor: '#404040',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        whiteSpace: 'pre-line', // Preserve newlines in placeholder
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                    }}
                />
                <Button
                    type="submit"
                    sx={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        fontSize: '18px',
                        backgroundColor: '#84E291',
                        color: "#646464",
                        width: '350px',
                        height: '70px',
                        '&:hover': {
                            backgroundColor: 'darkgreen',
                        },
                        marginLeft: '1000px',

                    }}
                >
                    Submit➤➤➤
                </Button>
            </form>
        </div>
    );
}

export default DescribeUser;