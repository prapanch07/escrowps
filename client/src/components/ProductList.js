import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout  from './BaseLayout';



const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [bidProducts, setBidProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const userId = localStorage.getItem('user_id');
    const subscriber = localStorage.getItem('subscriber');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    localStorage.setItem('page_now', 'explore');

    console.log(subscriber)


    const fetchProducts = async() => {
      try {
          const response = await axios.get(`${BACKEND_URL}/api/products`);
          console.log('response.data',response.data);
          const unsoldProducts = response.data.filter(product => !product.isSold && product.seller !== userId);
          console.log('unsoldProducts',unsoldProducts)
          setProducts(unsoldProducts);
          const bidProducts = unsoldProducts.filter(product => product.allow_bids);
          setBidProducts(bidProducts);
          setSearchResults(unsoldProducts);
      } catch (error) {
          
          console.error("Error Fetching Products:", error);
          
      }
    };


    useEffect(() => {
        

        const fetchBidProducts = async() => {
          try {
              const response = await axios.get(`${BACKEND_URL}/api/products/bidProducts`);
              setBidProducts(response.data);
          } catch (error) {
              
              console.error("Error Fetching Bid Products:", error);
                
            };
        };
          fetchProducts();
      }, []);

      const handleSearch = () => {
        console.log('searchKeyword',searchKeyword)
        if (searchKeyword.trim() === '') {
          
            setSearchResults(products); 
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
            setProducts(searchResults);
        }
    };

    console.log('products: ',products);

    const bidNow = async(productId) =>{
      try{
        
        navigate('/bookbids')
      }
      catch(error){
        console.error("Error finding bidroom")
      }
    }

    const notifySubscription = () =>{
      console.log('notifySubscription')
      setShowSubscriptionModal(true);
    };

    const closePopup =() => {
      setShowSubscriptionModal(false);
    }

    const handleSubscription =() => {
      setShowSubscriptionModal(false);
      if (!isAuthenticated){
          navigate('/login')
      }else{

          console.log(isAuthenticated);
          const amount = 100;
          const type = 'subscription';
          const note='Subscribe to access premium features';
          navigate('/payment', { state: { amount,  type, note } });
      }
    }

    const handleAddProduct = () => {
        navigate('/AddProduct');
    };
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? bidProducts.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === bidProducts.length - 1 ? 0 : prevIndex + 1));
    };
    
    // console.log('searchResults: ',searchResults);
    // console.log('products: ', products);
    
    
    return (
          <BaseLayout>
          {showSubscriptionModal && (
            <div className="popup-container ">
              <div className="popup-content text-center">
                  <h5>Subscribe for Access</h5>
                  <p >Unlock premium features by subscribing.</p>
                  
                      <button onClick={handleSubscription} className='btn btn-success btn-sm' style={{width:'7em', borderRadius:'15px'}}>Subscribe</button>
                      <button onClick={closePopup} className='btn btn-danger btn-sm' style={{marginLeft:'1em',width:'7em', borderRadius:'15px' }}>Close</button>
                  
              </div>
            </div>  
            )}
          <div className="row " style={{width:'1330px', border:'solid'}}>
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
                      onClick={handleSearch} 
                  >Search</button>
                </div>
              </div>
            </div>
            {products.length === 0 && 
            <div className='text-center col-12'>
              <h6 className='text-center'>No data...</h6>
            </div>
            }


            <div id="carouselExampleIndicators" className="carousel slide mt-2" data-ride="carousel" data-interval="4000" style={{width:'100%'}}>
              <ol className="carousel-indicators">
                {bidProducts.map((product, index) => (
                  <li data-target="#carouselExampleIndicators" data-slide-to="${index}" className={index === 0 ? "active" : "" } style={{width:'6px'}}></li>
                ))}
              </ol>
              <div className="carousel-inner">
              {bidProducts.map((product, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} >
                    <img className="d-block  mx-auto" src={`${BACKEND_URL}/${product.image}`} alt={`Slide ${index + 1}`} style={{height:'50vh', width:'90%'}}/>
                    <div className="carousel-caption d-none d-md-block carousel-text">
                      <p style={{color:'black', fontSize:'60px', lineHeight: '.8', textShadow: '2px 2px 2px white'}}>
                      {product.name.length > 30 ? `${product.name.substring(0, 30)}...` : product.name} 
                      </p>
                      <p style={{color:'black', marginTop:'1em', fontSize: '26px', textShadow: '2px 2px 2px rgba(255, 255, 255, 0.5)', backgroundColor:"rgba(255, 255, 255, 0.3)" }}>
                      {product.description.length > 350 ? `${product.description.substring(0, 350)}...` : product.description}
                      </p>
                      <div className='row' style={{width: "50%"}}>
                        {subscriber === 'true' ? (
                          <a onClick={() => bidNow(product._id)} className='btn btn-success mr-auto' style={{borderRadius:'20px', width:'7em', cursor: 'pointer'}}>Bid Now</a>
                        ):(
                          <a onClick={notifySubscription} className='btn btn-success mr-auto' style={{borderRadius:'20px', width:'7em', cursor: 'pointer'}} >
                             <img src='../assets/images/locked_1.png' alt='Your Chats Image' style={{ width: '19px', marginLeft: 'auto', marginRight: '6px', marginBottom:'6px' }} />
                             Bid Now
                          </a>
                        )} 
                        
                        <a className='btn btn-white mx-auto' style={{borderRadius:'20px', width:'7em', border:'solid 1px white'}}>More info</a>
                      </div>
                      
                    </div>
                  </div>
              ))}
              </div>
              <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>






            <div className="row mt-3" style={{width:'100%'}}>
              {products.map((product) => (
                <div className="col-md-3" key={product._id}>
                  <div className="card product_card" style={{ backgroundImage: `url(${BACKEND_URL}/${product.image})`}}>
                    <div className="card-body pro-card-body">
                      <a href={`ProductDetails/${product._id}`}>
                      {/* <a onClick={() => navigate(`/ProductDetails/${product._id}`)}> */}
                        <h3 style={{ color: 'black' }}>{product.name}</h3>
                      </a><br />
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