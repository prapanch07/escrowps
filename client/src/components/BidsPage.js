import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout from './BaseLayout';

const BidsPage = () => {
    const [bids, setBids] = useState([]); 
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const navigate = useNavigate();
    localStorage.setItem('page_now', 'bids');
    
    
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fetchBids();
        }
    }, [isAuthenticated, navigate]);

    const fetchBids = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post(`${BACKEND_URL}/api/bids/fetch`, { user_id: userId });
            setBids(response.data); 
        } catch (error) {
            console.error('Error fetching bids:', error);
        }
    }

    return (
        <BaseLayout>
            <div className="row mt-3" style={{ width: '1330px' }}>
                <div className='container mb-4'>
                    <h2>My bids</h2>
                    {bids.length === 0 && <p className='mt-5'>No bids...</p>}
                    {bids.map(bid => (
                        <div className='row mt-4 bids_card' key={bid._id}>
                            <div className='col-md-3'>
                                <h5 className='text-center'>{bid.product.name}</h5>
                                <p  className='text-center'>By: {bid.product.seller.username}</p>
                            </div>
                            <div className='col-md-2'>
                                <h6 className='text-center'>Amount: {bid.amount}</h6>
                            </div>
                            <div className='col-md-5'>
                                <p className='text-center' style={{ fontSize: 'large' }}>{bid.description.substring(0,90)}...</p>
                            </div>
                            <div className='col-md-2'>
                                <p className='text-center' style={{ fontSize: 'large' }}>{bid.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BaseLayout>
    )
}

export default BidsPage;
