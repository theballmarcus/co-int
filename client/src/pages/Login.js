import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData.email, formData.password);
            setResponseMessage(response.message);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred');
            setResponseMessage('');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <form 
                onSubmit={handleSubmit} style={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    inputProps={{style: {
                        fontSize: 40,
                        textAlign: 'center',
                        height: '150px',

                    }}} 
                    InputLabelProps={{style: {fontSize: 22}}} 
                    sx={{ 
                        marginTop: '235px',
                        backgroundColor: '#404040',
                        color: '#646464',
                        width: '700px',

                        '& .MuiInputBase-root': {
                            color: '#ffffff',  // Text color inside the field
                        },
                        '& .MuiInputLabel-root': {
                            color: '#ffffff',  // Label color
                        },
                        '& .MuiOutlinedInput-root': {
                            borderColor: '#646464',  // Border color when the field is not focused
                        },
                        '& .MuiOutlinedInput-root.Mui-focused': {
                            borderColor: '#ffffff',  // Border color when the field is focused
                        }
                     }}
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    inputProps={{style: {
                        fontSize: 40,
                        textAlign: 'center',
                        height: '150px',

                    }}} 
                    InputLabelProps={{style: {fontSize: 22}}} 
                    sx={{ 
                        marginTop: '150px',
                        backgroundColor: '#404040',
                        color: '#646464',
                        width: '700px',

                        '& .MuiInputBase-root': {
                            color: '#ffffff',  // Text color inside the field
                            
                        },
                        '& .MuiInputLabel-root': {
                            color: '#ffffff',  // Label color

                        
                        },
                        '& .MuiOutlinedInput-root': {
                            borderColor: '#646464',  // Border color when the field is not focused

                        },
                        '& .MuiOutlinedInput-root.Mui-focused': {
                            borderColor: '#ffffff',  // Border color when the field is focused
                        }
                    }}                
                />
                <button type="submit" style={{ display: 'none' }}>Submit</button>
                {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#404040',
                            color: '#646464',
                            borderRadius: '20px',
                            '&:hover': {
                                backgroundColor: '#333333',
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box> */}
            </form>

            {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Box>
    );
};

export default Login;
