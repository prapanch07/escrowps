import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import BidRoom from './bidRoom';


const BidChat = () => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('user_id');
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const [bidroomId, setBidroomId] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [bids, setBids] = useState([]);
    const [productname, setProductname] = useState('');
    const [highestbid, sethighestbid] = useState('');
    const [bid_open, setBidopen] = useState(true);
    const [bidClosed, setBidClosed] = useState(false);
    
    const [deletedproduct, setDeletedproduct] = useState(true);
    const [sortedbids, setSortedbids] = useState([]);
    const [bidwon, setBidwon] = useState(false);
    const [firstBid, setFirstBid] = useState(null);
    const [firstBidpay, setFirstBidpay] = useState(false);
    const [openig_bid, setOpenig_bid] = useState(0)
    const [showmgs, setShowmgs] = useState(false);
    const [msg, setmsg] = useState('');
    const [invalidflag, setInvalidflag] = useState(false);
    const [BidStartTime, setBidStartTime] = useState(8);
    const [BidCloseTime, setBidCloseTime] = useState(22);
    const [currentHour, setCurrentHour] = useState(null);
    localStorage.setItem('page_now', 'bids');


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    });
    useEffect(() => {
        if (location.state?.bidroomId) {
            setBidroomId(location.state.bidroomId);
        }
    }, [location.state]);

    useEffect(() => {
        if (bidroomId){
            fetchBids(bidroomId);
        }
    }, [bidroomId]);

    const getBidProducts = async () => {
        
        try{
            const response = await axios.get(`${BACKEND_URL}/api/bids/getLivebids`);
            setBidStartTime(response.data.upcomingBiddays.bid_startingTime);
            setBidCloseTime(response.data.upcomingBiddays.bid_closingTime);

        }catch(error){
            console.log("Error fetching products", error)
        }
    };

    const getCurrentHour = () => {
        const date = new Date();
        const hour = date.getHours();
        setCurrentHour(hour);
      };

    useEffect(() => {
        getBidProducts();
        getCurrentHour();
        console.log('currentHourcurrentHour',currentHour)
        console.log('BidStartTimeBidStartTime',BidStartTime)
        
        
    }, [])

    useEffect(() => {
        if ((currentHour +1  === BidStartTime) || (currentHour + 1  === BidCloseTime)) {
            const intervalId = setInterval(() => {
                getBidProducts();
                getCurrentHour();
              }, 1000); 
          
              return () => clearInterval(intervalId);
          }
    }, [currentHour, BidStartTime, BidCloseTime])

    const fetchBids = async (bidroomId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/bids/bidBybidroom/${bidroomId}`);
            setBids(response.data.bids);
            setProductname(response.data.productname);
            setBidopen(response.data.open);
            setBidClosed(response.data.closed);
            setDeletedproduct(response.data.deletedproduct);
            setOpenig_bid(response.data.openig_bid);
        } catch (error) {
            console.log("Error fetching bids");
        }
    }

    useEffect(() => {
        if (bids.length > 0) {
            // Find the highest bid amount
            const highestBidAmount = Math.max(...bids.map(bid => bid.amount));
            sethighestbid(highestBidAmount);
        }
    }, [bids]);

    const createBid = async (e) => {
        e.preventDefault();
        try {
            console.log('bidAmount',bidAmount)
            console.log('openig_bid',openig_bid)
            let parsedBidAmount = parseFloat(bidAmount);
            console.log('parsedBidAmount',parsedBidAmount)
            if (openig_bid > parsedBidAmount){
                console.log('invalid bid amount')
                setInvalidflag(true);
            }else{
                const response = await axios.post(`${BACKEND_URL}/api/bids`,{
                    bidAmount: bidAmount,
                    userId: userId,
                    bidroomId: bidroomId
                });
                setInvalidflag(false);
                setBidAmount('');
                fetchBids(bidroomId);
            }
        }catch(error){
            console.log("Error sending bid", error);
        }
        
    }

    const closeinvalidflag=()=>{
        setInvalidflag(false);
    }

    const sortBidsDescending = () => {
        const sortedBids = [...bids]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); 
        setSortedbids(sortedBids);
    };

    useEffect(() => {
        if (bids.length > 0) {
            sortBidsDescending();
        }
    }, [bids]);

    useEffect(() => {
        if (bidClosed===true){
            console.log('bid closed');
            setFirstBid(sortedbids[0]);
        }
    }, [bidClosed, sortedbids]);

    useEffect(()=>{
        console.log('bid_open',bid_open)
        console.log('bidClosed',bidClosed)
        if (!bid_open) {
            console.log('!bid_open')
            setShowmgs(true);
            if (bidClosed){
                console.log('bidClosed')
                console.log()
                setmsg('Bidding Closed')
            }else{
                console.log('bid not Closed')
                setmsg('Bidding not yet open');
            }
        }
        
    }, [bidClosed, bid_open]);

    useEffect(() => {
        if (firstBid){
            console.log('firstBid in function',firstBid);
            if (firstBid.customer._id === userId){
                setBidwon(true)
            }
        }
    }, [firstBid]);

    const closebuton =() =>{
        setBidwon(false)
    }

    useEffect(() => {
        if (firstBid){
            console.log('firstBid in function',firstBid);
            if (firstBid.payment === true){
                setFirstBidpay(true)
            }else{
                console.log('pament not complted')
            }
        }
    }, [firstBid]);

    const handlepaynow =()=>{
        const amount = firstBid.amount;
        const type = 'bidpurchase';
        const bidId = firstBid._id;
        navigate('/payment', { state: { amount,  type, bidId } });
    }


    console.log(BidStartTime)
    console.log(BidCloseTime)
    console.log('currentHour',currentHour)

    


    return(
        <BidRoom>
            {bidwon && (
            <div className="popup-container ">
                <div className="popup-content text-center" style={{border:'solid black'}}>
                    
                    <h5>{firstBidpay ? 'Congratulations!' : 'Makepayment'}</h5>
                    <p style={{fontSize:'20px', marginTop:'1em'}}>You got this bid for {firstBid.amount}. {firstBidpay ? '' : 'Please make payment to collect'}</p>
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                        {firstBidpay ? ( <>
                            <button disabled className='btn btn-success btn-sm mx-auto'>Payment complted</button>
                            <button className='btn btn-success btn-sm' onClick={closebuton}>Close</button></>
                            
                        ) :(
                            <button onClick={handlepaynow} className='btn btn-success btn-sm mx-auto'>Pay now</button>
                        )}
                    
                        
                    </div>

                </div>
                
            </div>  
            )}
            {invalidflag && (
            <div className="popup-container " style={{border:'solid'}}>
                <div className="popup-content text-center" style={{border:'solid black'}}>
                    
                    <h5>Invalid Bid Amount!!!</h5>
                    <p style={{fontSize:'16px', marginTop:'1em'}}>The opening bid is {openig_bid}</p>
                    <p style={{fontSize:'14px', marginTop:'1em'}}>You can't place bid below it.</p>
                    <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className='btn btn-success btn-sm' onClick={closeinvalidflag} style={{width:'15em'}}>Ok, I understand</button>
                            
                      
                            
                       
                    
                        
                    </div>

                </div>
                
            </div>  
            )}
            <div className='row'>
                <div className='row col-10' style={{}}>
                    


                    <div className='chat_head row' style={{  width: '100%' }}>
                        <div className='col-5' style={{  }}>
                            <h5 style={{  }}>{productname}</h5>
                        </div>
                        <div className='col-4' style={{  }}>
                            <h6 style={{  }}>Highest: {highestbid}</h6>
                        </div>
                        <div className='col-3' style={{  }}>
                            <h6 style={{  }}>Total bids: {bids.length}</h6>
                        </div>
                        
                    </div>

                    <div ref={chatContainerRef}  className='container  chat_container'>
                    {bidroomId === '' ? (
                            <div className='text-center' style={{ backgroundColor: 'black', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <img src='../assets/images/bid_image.png' alt='Your Chats Image' style={{ width: '11em', marginLeft: 'auto', marginRight: 'auto' }} />
                                <p>Your bids go here</p>
                            </div>
                        ) : (
                    
                            <div style={{ display: 'flex', flexDirection: 'column'}}>
                            
                                <div></div>
                                {bids.map((bid, index) => (
                                    <React.Fragment key={bid._id}>
                                        {index % 10 === 0 ? (
                                            <div className='mx-auto' style={{ width: '100%', borderBottom: 'solid aqua 1px', borderRadius:'10px', textAlign:'center', backgroundColor:'black' }}>
                                                <p>{bid.product.name}</p>
                                            </div>
                                        ) : null}
                                        <div className={`mt-2 ${bid.customer._id === userId ? 'sender_msg' : 'reciver_msg'}`} >
                                            <p className='mb-0'>{bid.customer.username}</p>
                                            <div className='msg_content mt-0'>
                                                <p>{bid.amount}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                                {showmgs ? (
                                    <div className='mx-auto mt-3' style={{ width: '100%', borderBottom: 'solid aqua 1px', borderRadius:'10px', textAlign:'center', backgroundColor:'black' }}>
                                        <p style={{fontSize:'small'}}>{msg}</p>
                                    </div>
                                ) : '' }
                                {deletedproduct ? (
                                    <div className='mx-auto mt-3' style={{ width: '100%', borderBottom: 'solid aqua 1px', borderRadius:'10px', textAlign:'center', backgroundColor:'black' }}>
                                        <p style={{fontSize:'small'}}>This product is deleted </p>
                                    </div>
                                ) : '' }
                                
                        </div>
                        )};
                        
                    </div>
                    <div className='container  chat_container_form'>
                        <form onSubmit={createBid}>
                            <div className='chat_form row'>
                                <input
                                    type='number'
                                    placeholder='Enter Your Bid Amount'  
                                    className='chat_input col-10'
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                />
                                
                                    {bid_open && !deletedproduct ? (
                                        <button
                                            type='submit'
                                            className='chat_sub col-2 text-white'
                                        >
                                            Send
                                        </button>
                                    ) : ('')}
                                
        
                            </div>
                        </form>
                    </div>
                </div>
                <div className='col-2' >
                    <h5 className='mt-2'>Top 5 Bids</h5>
                    <p>{BidStartTime<12 ? <>{BidStartTime}AM</>:<>{BidStartTime-12}PM</>}  to {BidCloseTime<12 ? <>{BidCloseTime}AM</>:<>{BidCloseTime-12}PM</>}</p>
                    {sortedbids.map((bid, index) => (
                        <div key={bid._id} className='p-1 my-2' style={{ backgroundColor: `rgba(0, 128, 0, ${1 - index * 0.15})`, borderRadius: "5px", display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h5 className=''>{bid.amount}</h5>
                            </div>
                            <p className='' style={{ marginLeft: 'auto' }}>{bid.customer.username}</p>
                        </div>
                    ))}

                    
                    
                </div>
            </div>
        </BidRoom>
    )
};

export default BidChat;