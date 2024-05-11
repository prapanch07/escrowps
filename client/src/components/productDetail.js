import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios' ;
import BaseLayout  from './BaseLayout';
import { BACKEND_URL } from '../App';


const ProductDetails = () => {
    const { productId } = useParams();
    const userId = localStorage.getItem('user_id');
    const [product, setProduct] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidDescription, setBidDescription] = useState('');
    const [bidError, setBidError] = useState('');
    const [showBidForm, setShowBidForm] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const subscriber = localStorage.getItem('subscriber');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async() => {
            try {
                
                // const response = await axios.get('http://localhost:5000/api/products/${productId}');
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setProduct(response.data);
                // console.log("Fetched Products:", response.data);
            } catch (error) {
                
                console.error("Error Fetching Products:", error);
                
            }
        };
        fetchProduct();
    }, [productId]);

    const handleBidSubmit = async (event) => {
        event.preventDefault();
        if (parseInt(bidAmount) <= product.price) {
            setBidError("Bid amount must be higher than the product price.");
            return;
        } 

        try {
            await axios.post(`${BACKEND_URL}/api/bids`, { productId, bidAmount, bidDescription, userId });
        } catch (error) {
            console.error("Error submitting bid:", error);
        }
    }

    const handleBuy = async() => {
        try {
            await axios.post(`${BACKEND_URL}/api/cart/purchases`, { productId, userId });
            navigate('/cart');
        } catch (error){
            console.error('Error creating cart:", error')
        }
    }

    const handleBidAmountChange = (event) => {
        const newBidAmount = event.target.value;
        setBidAmount(newBidAmount);
        if (parseInt(newBidAmount) > product.price && bidError) {
            setBidError('');
        }
    }



    const toggleBidForm = () => {
        setShowBidForm(!showBidForm);
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
    

    if (!product) {
        return <p>Loading...</p>;
    }
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
        <div className="container-fluid new_det_container" style={{ width:'70%'}}>
            <div className="container" style={{padding : '0'}}>
                <div className="row ">
                    
                    <div className="col-12 bg_img text-center position-relative d-flex flex-column justify-content-between" style={{backgroundImage: `url(${BACKEND_URL}/${product.image})`, width:'5em', height:'500px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
                        <h1 className="m-auto" style={{maxWidth:'70%', color:'black'}}>{product.name}</h1>
                        <p className="ml-auto mr-5 mb-4" style={{fontSize:'large', color:'black'}}>{`Patent to ${product.ownerName}`}</p>
                    </div>
                    <div className="mb-0 p-2" >
                        
                        {subscriber === 'true' ? (
                            <p style={{fontSize:'larger'}}>Posted by: <a href={`/chat?s_Id=${product.seller._id}`}  className="">{product.seller.fullname}</a></p>
                        ) :(
                            <p style={{fontSize:'larger'}}>Posted by: {product.seller.fullname}</p>
                        )}
                        
                        <p className="pt-4" >{product.description}</p> 
                        {/* <hr style={{border: 'solid 1px white'}} /> */}
                        <p className="mt-2">{`Patent name: ${product.name}`}</p> 
                        <p className="mt-2">{`Patent to: ${product.ownerName}`}</p>
                        <h3 className="pt-4 ">Price: {product.price}</h3>
                        <div className="row">
                            <div className="ml-auto mt-4">
                                
                            </div>
                            <div className="ml-auto mt-4 text-center">
                                {subscriber === 'true' ? (
                                    <>
                                        <a href={`/chat?s_Id=${product.seller._id}`} >Chat with seller</a><br/><br/>
                                        <a onClick={handleBuy} className="btn btn-white" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', fontSize: '20px', borderRadius: '0', width: '25em' }}>BUY</a><br/><br/>
                                    </>
                                ) :(
                                    <>
                                        <img src='../assets/images/locked.png' alt='Your Chats Image' style={{ width: '19px', marginLeft: 'auto', marginRight: '6px', marginBottom:'6px' }} />
                                        <a onClick={notifySubscription} style={{cursor:"pointer", color:"blue", fontSize:'18px'}}>Chat with seller</a><br/><br/>
                                        <a onClick={notifySubscription} className="btn btn-white" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bolder', fontSize: '20px', borderRadius: '0', width: '25em' }}>
                                            <img src='../assets/images/locked_1.png' alt='Your Chats Image' style={{ width: '19px', marginLeft: 'auto', marginRight: '6px', marginBottom:'6px' }} />
                                                BUY
                                        </a><br/><br/>
                                    </>
                                )}
                                
                                
                                <a className="btn btn-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.33)', color: 'white', fontWeight: 'bolder', fontSize: '20px', borderRadius: '0', width: '25em' }}>Download Research Paper</a>
                            </div>
                            <div className="ml-auto mt-4 mr-auto">
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            {/* <button onClick={handleAddProduct}>Add Product</button> */}
            {/* {showBidForm && ( */}
                {/* <div className="mt-5 bg-white" id="bidsubmit"> */}
                <div className={`mt-5 bg-white ${showBidForm ? 'show-bid-form' : 'hide-bid-form'}`} id="bidsubmit">
                    <form onSubmit={handleBidSubmit}>
                        <div className="row p-4">
                            <div className="col-md-9">
                                <textarea 
                                    className="form-control"
                                    placeholder="Your bid details here..."
                                    style={{height:'6em'}}
                                    value={bidDescription}
                                    onChange={(e) => setBidDescription(e.target.value)}
                                    required
                                    >

                                </textarea>
                            </div>
                            <div className="col-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Your bid amount"
                                    value={bidAmount}
                                    onChange={handleBidAmountChange}
                                    required>
                                </input>
                                {bidError && <p style={{ color: 'red', fontSize:'small' }}>{bidError}</p>}
                                <button 
                                    type="submit"
                                    className="btn btn-success mt-3"
                                    style={{width:'100%'}}>
                                        Send bid
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
             {/* )} */}
                
                
            </div>

            
            
        </div>
        
        </BaseLayout>


        
    );
};

export default ProductDetails;