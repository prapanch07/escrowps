import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import axios from 'axios';
import { BACKEND_URL } from '../App';
const userId = localStorage.getItem('user_id');

const BidBookingPage = () => {
    localStorage.setItem('page_now', 'bids');
    const navigate = useNavigate();
    const [showBids, setShowBids] = useState(false);
    const [showPurCard, setShowPurCard] = useState(false)
    const [liveBids, setLivebids] = useState([]);
    const [upcomingBidDays, setUpcomingBidDays] = useState([]);
    const [allBidrRooms, setAllBidrRooms] = useState([]);
    const [participatingBidRooms, setParticipatingBidRooms] = useState([]);
    const [nonParticipatingBidRooms, setNonParticipatingBidRooms] = useState([]);
    const [selectedBidRoom, setSelectedBidRoom] = useState([]);
    const [openingBid, setOpeningBid] = useState('');
    const [reenteredBid, setReenteredBid] = useState('');
    const [disableContinue, setDisableContinue] = useState(true);
    const [BidDay, setBidDay] = useState('');
    const [BidStartTime, setBidStartTime] = useState(8);
    const [BidCloseTime, setBidCloseTime] = useState(22);

    


    useEffect(() => {
        getBidProducts();
    }, []);


    
    const getBidProducts = async () => {
        
        try{
            const response = await axios.get(`${BACKEND_URL}/api/bids/getLivebids`);
            setAllBidrRooms(response.data.bidrooms);
            setUpcomingBidDays(response.data.upcomingBiddays.firstFiveBidDays)
            setBidDay(response.data.upcomingBiddays.day)
            setBidStartTime(response.data.upcomingBiddays.bid_startingTime);
            setBidCloseTime(response.data.upcomingBiddays.bid_closingTime);

        }catch(error){
            console.log("Error fetching products", error)
        }
    };

    useEffect(() => {
        const userParticipantBidRooms = allBidrRooms.filter(bidRoom =>
            bidRoom.participants.includes(userId)
        );
        const userNonParticipantBidRooms = allBidrRooms.filter(bidRoom =>
            !bidRoom.participants.includes(userId)
        );
    
        setParticipatingBidRooms(userParticipantBidRooms);
        setNonParticipatingBidRooms(userNonParticipantBidRooms);
    }, [allBidrRooms]);
    

    const showNonParticipating = (date) => {
        setLivebids(nonParticipatingBidRooms.filter(bidRoom => 
            bidRoom.bidding_date === date && !bidRoom.closed
        ));
        setShowBids(true);
    }

    
    const closeShowBids =() => {
        setShowBids(false);
       
    } 

    const closePurCard =() => {
        setShowPurCard(false)
    }

    const addtobid = (bidroomId) => {
        setSelectedBidRoom(allBidrRooms.find(bidRoom => bidRoom._id === bidroomId));
        setShowPurCard(true)
    }

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const formattedDate = `${date.getDate().toString().padStart(2, '0')} / ${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`;
        return formattedDate;
    };

    const handleOpeningBidChange = (event) => {
        setOpeningBid(event.target.value);
        validateBids(event.target.value, reenteredBid);
    };

    const handleReenteredBidChange = (event) => {
        setReenteredBid(event.target.value);
        const eventValueAsNumber = parseFloat(event.target.value);
        if (selectedBidRoom.openig_bid === eventValueAsNumber){
            setDisableContinue(false);
        }else {
            setDisableContinue(true);
        }
        // validateBids(openingBid, event.target.value);
    };

    const validateBids = (openingBid, reenteredBid) => {
        if (openingBid === reenteredBid) {
            setDisableContinue(false);
        } else {
            setDisableContinue(true);
        }
    };

    const goToPayment =()=> {
        const type = 'bidbooking';
        const amount= 100;
        const bidroomId = selectedBidRoom._id;
        const note = 'Make the payment to book your seat';
        navigate('/payment', { state: { amount,  type, bidroomId, note } });
    }

    const gotoBidChat = (bidroomId)=>{
        navigate('/bids', { state: { bidroomId } })
    }
    
    const todayDate = new Date();


    return(
      <BaseLayout>
        {showBids && (
            <div className="popup-container " >
                <div className="popup-content text-center" style={{border:'solid black'}}>
                    <p style={{fontSize:'20px'}}>Select you Patent</p>
                    <div className='row live_bid_img_container'>    
                        
                        {liveBids.map(livebid => (
                            <div className='' style={{ position: 'relative'}}>
                                <img className='live_bid_img' src={`${BACKEND_URL}/${livebid.product.image}`}/>
                                <div onClick={() => addtobid(livebid._id)} className='overlay' style={{cursor:'pointer'}}>
                                    <h5 className="heading" style={{fontSize:'24px', textTransform:'capitalize'}}>{livebid.product.name}</h5>
                                    <p className='patent-text' style={{fontSize:'16px', fontWeight:'bold'}}>Patent to: {livebid.ownerName}</p>
                                </div>
                            </div>
                        ))}
                        
                    </div>
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={closeShowBids} className='btn btn-danger btn-sm'>Close</button>
                    </div>

                </div>
                
            </div>  
            )}


        {showPurCard && (
            <div className="popup-container " >
                <div className="popup-content text-center">
                    <div className="row pur_card" style={{width:'70em'}}>
                        <div className="col-3 " style={{borderBottom:'solid 1px'}}>
                            <img src={`${BACKEND_URL}/${selectedBidRoom.product.image}`} style={{width:'12em', height:'10em'}}></img>
                        </div>
                        <div className="col-9 py-1" style={{borderBottom:'solid 1px',  borderRight:'solid 1px', textAlign:'left'}}>
                            <h6 style={{color:'black', marginTop:'2em'}}>Patent Name : {selectedBidRoom.product.name}</h6>
                            <h6 style={{color:'black', marginTop:'1em'}}>Patented to: {selectedBidRoom.product.seller.username}</h6>
                            <h6 style={{color:'black', marginTop:'1em'}}>Patented date: {formatDate(selectedBidRoom.product.createdAt)}</h6>
                        </div>
                        <div className="col-12 mt-2 p-2" style={{borderBottom:'solid 1px', borderRight:'solid 1px'}}>
                            <div className='row' >
                                <p className='col-4' >Opening bid</p>
                                <input 
                                    type='text' 
                                    value={selectedBidRoom.openig_bid}
                                    onChange={handleOpeningBidChange}
                                    style={{border:0, borderBottom:'solid 1px ', height:'2em', width:'40em'}}
                                ></input>
                            </div>
                            <div className='row'>
                                <p className='col-4'>Enter Opening bid As shown above</p>
                                <input 
                                    type='number' 
                                    value={reenteredBid}
                                    onChange={handleReenteredBidChange}
                                    style={{border:0, borderBottom:'solid 1px ', height:'2em', width:'40em'}}
                                ></input>
                            </div>
                        </div>
                        <div className="col-12 mt-2 p-2" style={{borderBottom:'solid 1px', borderRight:'solid 1px'}}>
                            <div className='col-12' style={{textAlign:'left'}}>
                                <h6 style={{color:'black', marginLeft:'2em'}}>Price Details</h6>
                            </div>
                            <div className='row' >
                                <p className='col-3'>Price</p>
                                <p className='col-5'></p>
                                <p className='col-3'>100</p>
                            </div>
                            <div className='row'>
                               
                                <p className='col-3'>Total Amount</p>
                                <p className='col-5'></p>
                                <p className='col-3'>100</p>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                        <button disabled={disableContinue} onClick={goToPayment} className='btn btn-success btn-sm mx-auto'>Continue</button>
                        <button onClick={closePurCard} className='btn btn-danger btn-sm'>Close</button>
                    </div>

                </div>
                
            </div>  
            )} 


        <div className='row' style={{width:'100%', }}>
            <div className='col-12 text-center'  > 
              <h3>Weekly Auction Booking</h3>
              <p style={{fontSize:'large'}}>Auction on every {BidDay} {BidStartTime<12 ? <>{BidStartTime}AM</>:<>{BidStartTime-12}PM</>}  to {BidCloseTime<12 ? <>{BidCloseTime}AM</>:<>{BidCloseTime-12}PM</>}</p>
            </div>
            <div className="col-12 mb-5" style={{ paddingBottom:'0px', marginTop:'0px'}}>
             
            <table className='table text-center bid-table'>
                <thead>
                    <tr>
                        {upcomingBidDays.map(upcomingBidDay => (
                            <th key={upcomingBidDay}>
                                <p style={{ fontSize:'20px' }}>
                                {formatDate(new Date(new Date(upcomingBidDay).getTime() - 24 * 60 * 60 * 1000))}
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {upcomingBidDays.map(upcomingBidDay => (
                            <td key={upcomingBidDay}>
                                {participatingBidRooms
                                    .filter(bidroom => bidroom.bidding_date === upcomingBidDay)
                                    .map((bidroom, index) => (
                                        <div key={index} className='empty-bid ' style={{ marginBottom:'15px', marginTop:'0px', backgroundImage: `url(${BACKEND_URL}/${bidroom.product.image})`, backgroundSize: 'cover', backgroundPosition: 'center'  }}>
                                            <civ className='' >
                                                <div className='col-12' style={{maxWidth:'12em'}}>
                                                    <h5 style={{color:'black'}}>{bidroom.product.name}</h5>
                                                </div>
                                                <div>
                                                {bidroom.open ? 
                                                    <button className='btn btn-success btn-sm' onClick={() => gotoBidChat(bidroom._id)}>Bid now</button>
                                                : bidroom.closed ?
                                                    <button  className='btn btn-danger btn-sm' onClick={() => gotoBidChat(bidroom._id)}>Closed</button>
                                                :
                                                    <button disabled className='btn btn-success btn-sm'>Bid now</button>
                                                }
                                                </div>
                                            </civ>
                                        </div>
                                    ))
                                }
                                <div className='empty-bid' style={{ marginTop:'0px' }} onClick={() => showNonParticipating(upcomingBidDay)}>
                                    <p onClick={() => showNonParticipating(upcomingBidDay)} style={{ fontSize:'50px', fontWeight:'1px' }}>+</p>
                                    {/* <p>{upcomingBidDay}</p> */}
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
      </BaseLayout>
    )

};

export default BidBookingPage;