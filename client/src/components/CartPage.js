import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout from './BaseLayout';

const CartPage = () => {
    const [pendingCarts, setPendingCarts] = useState([]);
    const [purchasedCarts, setPurchasedCarts] = useState([]);
    const [carts, setcart ] = useState([]);

    const [purchaseCart, setPurchaseCart] = useState([]);
    const [pendingPurCarts, setPendingPurCarts] = useState([]);
    const [purchasedpurCarts, setPurchasedpurCarts] = useState([]);

    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    localStorage.setItem('page_now', 'cart');
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            fetchCarts();
            purchaseCarts();
        }
    }, [isAuthenticated, navigate]);

    const fetchCarts = async() => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post(`${BACKEND_URL}/api/cart`, { userId: userId });
            setcart(response.data);
        } catch (error) {
            console.error('Error fetching carts:', error);
        }
    }

    const purchaseCarts = async() => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await axios.get(`${BACKEND_URL}/api/cart/fetchPurCart/${userId}`);
            setPurchaseCart(response.data)
            console.log('response :',response)
            
        } catch (error) {
            console.error('Error fetching carts :', error)
        }
    }

    const handlePayment = (amount, cart_id, type ) => {
        const returnUrl = encodeURIComponent(location.pathname);
        
        console.log('Amount to pay:', amount);
        console.log(returnUrl)
        navigate('/payment', { state: { amount,  type, cart_id } });
    };
    
    useEffect(() => {
        setPendingCarts(carts.filter(cart => cart.status === 'pending' && !cart.bid.product.deleted));
        setPurchasedCarts(carts.filter(cart => cart.status === 'purchased'));
    }, [carts]);

    useEffect(() => {
        console.log('purchaseCart :',purchaseCart)
        setPendingPurCarts(purchaseCart.filter(cart => cart.status === 'pending'));
        setPurchasedpurCarts(purchaseCart.filter(cart => cart.status === 'purchased'));
        // setPurchasedCarts(carts.filter(cart => cart.status === 'pending'));
    }, [purchaseCart]);


    return(
        <BaseLayout>
            <div className='container-fluid cart_div'>
                <h3 className='mt-4 text-center'>Cart Page</h3>
                
                <div className='row'>
                    <div className='col-md-8'>
                        <h5>Payment pending Carts</h5>
                        <table className='table text-white mt-2 cart_table'  style={{border:'0'}}>
                            <tbody>
                                {pendingCarts.length !== 0 && (
                                    <tr className='text-center' style={{ textAlign:'center', borderBottom:'solid white 1px'}}>Cart from bidding</tr>
                                )}
                                {pendingCarts.map(cart => (
                                    <tr key={cart._id} className='cart_tr'>
                                        <td style={{Width:'4em'}}><img src={`${BACKEND_URL}/${cart.bid.product.image}`} style={{width:'4em', height:'3em',  borderRadius:'10%'}}></img></td>
                                        <td>
                                        {cart.bid.product.deleted ? 'Product not Available' : cart.bid.product.name}
                                        </td>
                                        <td>{cart.bid.product.seller.username}</td>
                                        <td>Amount: {cart.bid.amount}</td>
                                        <td><a onClick={() => handlePayment(cart.bid.amount, cart._id, 'bidcart')} className='btn btn-success btn-sm'>
                                            Pay Now
                                        </a></td>
                                    </tr>
                                ))}
                                <tr style={{height:'2em'}}></tr>
                                {pendingPurCarts.length !== 0 && pendingCarts.length !== 0 && (
                                    <tr className='text-center' style={{ textAlign:'center', borderBottom:'solid white 1px'}}>Normal Purchase</tr>
                                )}
                                {pendingPurCarts.map(cart => (
                                    <tr key={cart._id} className='cart_tr'>
                                        <td style={{maxWidth:'4em'}}><img src={`${BACKEND_URL}/${cart.product.image}`} style={{width:'4em',height:'3em',  borderRadius:'10%'}}></img></td>
                                        <td>{cart.product.name}</td>
                                        <td>{cart.product.seller.username}</td>
                                        <td>Amount: {cart.product.price}</td>
                                        <td><a onClick={() => handlePayment(cart.product.price, cart._id, 'normalcart') } className='btn btn-success btn-sm' >Pay Now</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <hr style={{ backgroundColor: 'rgba(255, 255, 255, 0.363)', height: '1px', border: 'none' }}/>
                        <h5 style={{marginTop:'3em'}}>Payment Completed Carts</h5>
                        <table className='table text-white mt-2 cart_table'  style={{border:'0'}}>
                            
                            <tbody>
                                {purchasedCarts.map(cart => (
                                    <tr key={cart._id} className='cart_tr'>
                                        <td style={{maxWidth:'4em'}}><img src={`${BACKEND_URL}/${cart.bid.product.image}`} style={{width:'4em',height:'3em',  borderRadius:'10%'}}></img></td>
                                        <td>{ cart.bid.product.name }</td>
                                        <td>{cart.bid.product.seller.username}</td>
                                        <td>Amount: {cart.bid.amount}</td>
                                        
                                    </tr>
                                ))}
                                {purchasedpurCarts.map(cart => (
                                    <tr key={cart._id} className='cart_tr'>
                                        <td style={{maxWidth:'4em'}}><img src={`${BACKEND_URL}/${cart.product.image}`} style={{width:'4em',height:'3em',  borderRadius:'10%'}}></img></td>
                                        <td>{cart.product.name}</td>
                                        <td>{cart.product.seller.username}</td>
                                        <td>Amount: {cart.product.price}</td>
                                    </tr>
                                ))}
                                
                            </tbody>
                            
                        </table>
                    </div>
                    <div className='col-md-4 '>
                        
                        {/* <h5>How to add to cart</h5> */}
                    </div>
                </div>
            </div>
        </BaseLayout>
    )

}

export default CartPage;