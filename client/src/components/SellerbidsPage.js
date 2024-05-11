import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import SellerBase from './SellerBase';

const SellerBidsPage = ( ) => {
  const { productId } = useParams();
  const [bidRoomsAndBids, setBidRoomsAndBids] = useState([]);
  const [product, setProduct] = useState(null);
  
  

  const fetchBids = async () => {
    try {
      console.log(productId)
      const response = await axios.get(`${BACKEND_URL}/api/bids/${productId}`);
      const { bidRoomsAndBids, product } = response.data;
      console.log(bidRoomsAndBids);
      setBidRoomsAndBids(bidRoomsAndBids)
      setProduct(product);
      console.log(bidRoomsAndBids);
      for (const room of bidRoomsAndBids) {
        console.log(room.bidroom.open);
      }
      
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [productId]); 
  
  const acceptBid = async (bidId) => {
    try {
      await axios.put(`${BACKEND_URL}/api/bids/${bidId}/accept`);
      window.location.reload();
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return formattedDate;
}

  return (
    <SellerBase>
      <div className='container-fluid sellerbids-container'>
        <div className="container pt-5">
          <h3>Top Bids recieved by <strong style={{textTransform:'capitalize'}}>{product ? product.name : 'Product'}</strong> </h3>
            
          {bidRoomsAndBids.map((bidRoomData, index) => (
            <div key={index} className="row mt-5 p-1" style={{ borderBottom: 'solid black ', borderRadius: '10px', backgroundColor: bidRoomData.bidroom.open ? '#c3e6cb' : '#f5c'  }}>
              <div className="col-2 text-center d-flex align-items-center justify-content-center row">
              <div className="col-12"><h6>{bidRoomData.bidroom.open  ? 'Live now' : 'Closed'}</h6> </div>
              <div className="col-12"><p>{formatDate(bidRoomData.bidroom.bidding_date)}</p></div>

            </div>
              
              {bidRoomData.bids.map((bid, index) => (
                
                  <div className="col-2 text-center" style={{backgroundColor: bid.status==='accepted' ? 'rgba(255, 255, 255, 0.5)': ''}}>
                    <h4>{bid.amount}</h4>
                    <p>{bid.customer.username}</p>
                    
                      
                  </div>
                
              ))}
              
            </div>
          ))}

          
        </div>
      </div>
    </SellerBase>
    
  );
};

export default SellerBidsPage;
