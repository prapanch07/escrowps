import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout  from './BaseLayout';


const HomePage = () => {
  const [products, setProducts] = useState([]);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  localStorage.setItem('page_now', 'home');
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

  return (
    <BaseLayout>
        <div style={{ textAlign: 'center' , display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

          {isAuthenticated ? (
              <div style={{maxWidth:'1050px'}}>
                <h1 style={{ textAlign: 'left', marginBottom: '1em', textTransform:'uppercase'}}> <strong>Revolutionalise</strong> the way <br />  of <strong>patent</strong> transactions</h1>
                <p style={{ textAlign: 'center' }}></p>
                <p style={{ textAlign: 'left', fontSize: '20px' }}>We reimagines the traditional patent marketplace, offering a dynamic and user-friendly environment where inventors, entrepreneurs, and businesses can easily sell, buy and bid patents. we revolutionizes the way patents are bought and sold, fostering a global community of innovators, entrepreneurs, and businesses eager to unlock the full potential of intellectual property.</p>
                <a href="/products" className="btn btn-outline-success" style={{ borderRadius:'20px', width: '10em', color: 'white'}}> Explore </a>
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

export default HomePage;