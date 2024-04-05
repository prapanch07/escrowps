import React, { useState } from "react";
import axios from "axios";
import BaseLayout  from './BaseLayout';

const Loginpage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/user/login', formData);
            console.log('Login successful:', response.data);
            // Add logic for handling successful login (redirect, set token, etc.)
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <BaseLayout>
            <div className="container-fluid" style={{ paddingBottom: '1em',paddingTop: '10em', border: 'solid', minHeight: '610px', backgroundImage: `url(${require('../assets/images/banner-bg.jpg')})`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="container-fluid text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)',  padding:'4em', paddingTop : '1em', paddingBottom : '2em', width:'40em' }}>
                    <h2>Login</h2>
                    <div className="">
                    
                        <form onSubmit={handleSubmit}>
                            <div className="" style={{ marginTop:'2em' }}>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    placeholder="User name"
                                    className="input-custom"
                                />
                            </div>
                            <div style={{ marginTop:'2em'}}>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password" // Placeholder text
                                className="input-custom" // Apply CSS class
                            />
                            </div>
                            {error && <div className="error" style={{marginTop:'1em'}}>{error}</div>}
                            <button type="submit" className="btn btn-success btn-sm" style={{ marginTop:'2em', width:'100%', borderRadius:'15px', marginTop:'2em' }}>Login</button>
                        </form>
                        <p style={{ fontSize:'large' }}>Don't have an Account? <a href="/register" style={{ textDecoration: 'underline', color:'white' }}>Click to Register</a> </p>
                    </div>
                    
                </div>
            </div>
        </BaseLayout>
    );
};

export default Loginpage;