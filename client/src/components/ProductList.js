import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout  from './BaseLayout';


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/products`);
                setProducts(response.data);
                setSearchResults(response.data);
                // console.log("Fetched Products:", response.data);
            } catch (error) {
                
                console.error("Error Fetching Products:", error);
                
            }
        };
        fetchProducts();
    }, []);
    const handleSearch = () => {
      if (searchKeyword.trim() === '') {
          setSearchResults(products); // Reset search results to all products when search keyword is empty
      } else {
          const filteredProducts = products.filter(product => {
              const { name, description, price } = product;
              const keyword = searchKeyword.toLowerCase();
              return (
                  name.toLowerCase().includes(keyword) ||
                  description.toLowerCase().includes(keyword) ||
                  price.toString().includes(keyword)
              );
          });
          setSearchResults(filteredProducts);
      }
  };

    const handleAddProduct = () => {
        console.log("Add Product button clicked");
        // Implement your logic to add a product here
        navigate('/AddProduct');
    };

    
    return (
          <BaseLayout>
          <div className="row mt-3" style={{width:'1330px', border:'solid'}}>
            <div className='col-12'>
              <div className="row mt-3 ml-auto mr-4">
                <div className='search_box_div ml-auto'>
                  <input type="text"
                    id="searchInput"
                    className='search_box ml-3'
                    placeholder="Enter search keyword"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  
                  <button 
                      className="btn btn-primary ml-2 search_button"
                      onClick={() => setProducts(handleSearch())} 
                  >Search</button>
                </div>
              </div>
            </div>
            {products.length === 0 && 
            <div className='text-center col-12'>
              <h6 className='text-center'>No data...</h6>
            </div>
              
            }
            <div className="row mt-3" style={{width:'100%'}}>
              {products.map((product) => (
                <div className="col-md-3" key={product._id}>
                  <div className="card product_card" style={{ backgroundImage: `url(${BACKEND_URL}/${product.image})`}}>
                    {/* <img src={`${BACKEND_URL}/${product.image}`} alt={product.name} className="card-img-top" style={{ width: '20%'}} /> */}
                    <div className="card-body pro-card-body">
                      <a href={`ProductDetails/${product._id}`}>
                        <h3 style={{ color: 'black' }}>{product.name}</h3>
                      </a>
                      {/* <p style={{ color: 'black' }}>{product._id}</p> */}
                      <p style={{ color: 'black' }}>{product.description.slice(0, 80)}...</p>

                      <div className="owner"><b>- </b>patent to {product.ownerName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BaseLayout>
    
        
    );
};

export default ProductList;