import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BaseLayout  from './BaseLayout';
import { useNavigate } from "react-router-dom";


const user_id = localStorage.getItem('user_id')
const BecomeSeller = () => {
  const [products, setProducts] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const subscriber = localStorage.getItem('subscriber');
  
  const navigate = useNavigate();
  
  const notifySubscription = () =>{
    setShowSubscriptionModal(true);
  };

  const closePopup =() => {
    setShowSubscriptionModal(false);
    navigate('/')
  }

  const handleSubscription =() => {
    setShowSubscriptionModal(false);
    if (!isAuthenticated){
        navigate('/login')
    }else{

        const amount = 100;
        const type = 'subscription';
        const note='Subscribe to access premium features';
        navigate('/payment', { state: { amount,  type, note } });
    }
  }


  useEffect(() => {
    if (subscriber === 'false') {
      setShowSubscriptionModal(true);
      notifySubscription();
    }
  }, [subscriber]);


  const handleJoinProgram = async () => {
    try {
      
      await axios.put(`${BACKEND_URL}/api/user/become_seller/${user_id}`);
      console.log('User successfully joined the program');
      localStorage.setItem('isSeller', 'true');
      navigate('/');
    } catch (error) {
      console.error('Error joining the program:', error);
    }
  };
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