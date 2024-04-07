import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout  from './BaseLayout';

const user_id = localStorage.getItem('user_id')
console.log('user_id:',user_id)
const BecomeSeller = () => {
  const [products, setProducts] = useState([]);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  console.log(BACKEND_URL)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        // const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);


  const handleJoinProgram = async () => {
    try {
      
      await axios.put(`${BACKEND_URL}/api/user/become_seller/${user_id}`);
      console.log('User successfully joined the program');
      localStorage.setItem('isSeller', 'true')
    } catch (error) {
      console.error('Error joining the program:', error);
    }
  };

  return (
    <BaseLayout>
        <div style={{ textAlign: 'center' , display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

          {isAuthenticated ? (
              <div style={{maxWidth:'1050px'}}>
                <h1 style={{ textAlign: 'left', marginBottom: '1em', textTransform:'uppercase'}}>Want to Become a seller?</h1>
                <p style={{ textAlign: 'center' }}></p>
                <p style={{ textAlign: 'left', fontSize: '20px' }}>You can post your products here. So that our customers will check your products and make bids.</p>
                <button onClick={handleJoinProgram} className="btn btn-outline-success" style={{ borderRadius:'20px', color: 'white', marginTop:'5em', width: '20em' }}> Yes I want to join this program </button>
              </div>
            ) : (
              <>
                <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Revolutionalise the way of patent transaction</h1>
                <p style={{ textAlign: 'center' }}></p>
                
                <a href="/login" className="btn btn-success" style={{ borderRadius:'20px', width:'10em' }}> Sign In  </a>
              </>
          )}




            
        </div>

        
      </BaseLayout>
  );
};

export default BecomeSeller;