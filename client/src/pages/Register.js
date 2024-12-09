import React, { useState } from 'react';
import { registerUser } from '../api'; 

const Register = () => {
    const [formData, setFormData] = useState({
        gamertag: '',
        age: '',
        description: '',
        email: '',
        password: '',
        confirm_password: '',
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
            const response = await registerUser(formData);
            setResponseMessage(response.message);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred');
            setResponseMessage('');
        }
    };

    return (
        <div style={{
            padding: '0px',
            margin: '0px',
        }}>
            <form 
                onSubmit={handleSubmit} style={{ 
                width: '100%',  
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
                className='register-form'
            >
                <div className="register-info-container">
                    <div className="register-tag_age-container">
                        <input
                            type="text"
                            name="gamertag"
                            placeholder="Gamertag"
                            value={formData.gamertag}
                            onChange={handleChange}
                            required
                            className='register-gamertag'
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            className='register-age'
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='register-email'
                    />
                </div>
                <div className="register-password-container">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className='register-password'
                    />
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        className='register-confirm-password'
                    />
                </div>

                <button type="submit" style={{
                    display: 'none'
                }}>Register</button>
            </form>

            {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Register;
