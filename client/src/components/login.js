import React, { useState } from "react";
import axios from "axios";
import BaseLayout from './BaseLayout';
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
    localStorage.setItem('page_now', 'login'); 
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/user/login', formData);
            console.log('Login successful:', response.data);
            // localStorage.setItem('token', response.data.token);
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('user_id', response.data.user_id);
            localStorage.setItem('isSeller', response.data.isSeller);
            localStorage.setItem('isAdmin', response.data.isAdmin);
            localStorage.setItem('subscriber', response.data.subscriber);
            console.log('Username:', localStorage.getItem('username'));
            console.log('User ID:', localStorage.getItem('user_id'));
            console.log('Admin status:', localStorage.getItem('isAdmin'));
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            setError(error?.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <BaseLayout>
            
                <div className="container-fluid text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)',  padding:'4em', paddingTop : '1em', paddingBottom : '0em', width:'40em', height:'20em', marginTop:'2em',marginBottom: '2em' }}>
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
                                placeholder="Password" 
                                className="input-custom" 
                            />
                            </div>
                            {error && <div className="error" style={{marginTop:'1em'}}>{error}</div>}
                            <button type="submit" className="btn btn-success btn-sm" style={{ marginTop:'2em', width:'100%', borderRadius:'15px' }}>Login</button>
                        </form>
                        <p style={{ fontSize:'large' }}>Don't have an Account? <a href="/register" style={{ textDecoration: 'underline', color:'white' }}>Click to Register</a> </p>
                    </div>
                    
                </div>
            
        </BaseLayout>
    );
};

export default Loginpage;