import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseLayout  from './BaseLayout';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <BaseLayout>
      <div className="container-fluid" style={{ paddingTop: '10em', border: 'solid', minHeight: '610px', backgroundImage: `url(${require('../assets/images/banner-bg.jpg')})`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center'}}>
            <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Revolutionalise the way of patent transaction</h1>
            <p style={{ textAlign: 'center' }}></p>
            <a href="#" className="btn btn-success" style={{ borderRadius:'20px', width: '10em', }}> Sign Up </a>
        </div>
    </div>

        <div>
        <h1  style={{ color: 'blue', fontSize: '24px' }}>Welcome to Our Store</h1>
        <p>Explore our wide range of products and find great deals!</p>
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4" key={product._id}>
              <div className="card">
              <img src={product.image} alt={product.name} className="card-img-top" style={{ width: '20%'}} /> {/* Image */}
                <div className="card-body"  style={{ color: 'black' }}>
                <a href={`ProductDetails/${product._id}`}>
                  <h3 style={{ color: 'black' }}>{product.name}</h3>
                </a>
                <p style={{ color: 'black' }}>{product._id}</p>
                  <p style={{ color: 'black' }}>{product.description}</p>
                  <p style={{ color: 'black' }}>Price: ${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </BaseLayout>
  );
};

export default HomePage;