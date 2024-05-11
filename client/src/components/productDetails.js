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
    

    if (!product) {
        return <p>Loading...</p>;
    }
    return (
        <BaseLayout>
        <div className="container-fluid det_container" style={{border:'solid'}}>
            <div className="container" style={{padding : '1em'}}>
                <div className="row mt-5">
                    <div className="col-md-6 mb-0" >
                        <h1>{product.name}</h1>
                        <p>patent to {product.ownerName}</p>
                        <p>Seller: {product.seller.fullname}</p>
                        
                        <p className="pt-4" style={{minHeight:'150px'}}>{product.description}</p>

                        <h3 className="pt-4 ">Price: {product.price}</h3>
                        <div className="row">
                            <div className="ml-auto mt-4">
                                <a className="btn btn-outline-success det_button"  onClick={toggleBidForm}>Bid now</a>
                            </div>
                            <div className="ml-auto mt-4">
                                <a className="btn btn-outline-success det_button"  onClick={toggleBidForm}>Buy</a>
                            </div>
                            <div className="ml-auto mt-4 mr-auto">
                            <a href={`/chat?s_Id=${product.seller._id}`}  className="btn btn-outline-primary  det_button">Chat</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6" style={{backgroundColor:'white'}}>
                        <img src={`${BACKEND_URL}/${product.image}`} alt={product.name} className="card-img-top" style={{ width:'100%' }} />
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