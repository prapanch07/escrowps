import React, { useState } from "react";
import axios from "axios";
import BaseLayout from './BaseLayout';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: ''
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please check and try again.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/user/register', formData);
            console.log('Register successful:', response.data);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message); // Set the error message sent from the server
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <BaseLayout>
            
            <div className="container-fluid text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)',  padding:'4em', paddingTop : '1em', paddingBottom : '0em', width:'40em', height:'32em', marginTop:'2em',marginBottom: '2em' }}>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="" style={{ marginTop: '1em' }}>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className="input-custom"
                            />
                        </div>
                        <div style={{ marginTop: '2em' }}>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="input-custom"
                            />
                        </div>
                        <div style={{ marginTop: '2em' }}>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="input-custom"
                            />
                        </div>
                        <div style={{ marginTop: '2em' }}>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="input-custom"
                            />
                        </div>
                        <div style={{ marginTop: '2em' }}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="input-custom"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '2em', width: '100%', backgroundColor: 'rgb(224, 18, 18)', borderRadius: '15px' }}>Register</button>
                    </form>
                    {error && <div className="error">{error}</div>}
                    <p style={{ fontSize: 'large', marginTop: '1em' }}>Already have an account? <a href="/login" style={{ textDecoration: 'underline', color: 'white' }}>Login here</a></p>
                </div>
            
        </BaseLayout>
    );
};

export default RegisterPage;