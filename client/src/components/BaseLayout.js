import React, { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Dropdown } from 'react-bootstrap';
 
const BaseLayout = ({ children }) => {
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    const isSeller = localStorage.getItem('isSeller');
    const isAdmin = localStorage.getItem('isAdmin');
    const subscriber = localStorage.getItem('subscriber');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const page_now = localStorage.getItem('page_now');
    const [currentTime, setCurrentTime] = useState('');
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        // const seconds = now.getSeconds();
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        setCurrentTime(formattedTime);
    };

    setInterval(getCurrentTime, 1000);
    

    const toggleDropdown  = (e) => {
        e.preventDefault()
        setShowDropdown(!showDropdown);
    };

    const viewDropdown1  = (e) => {
        e.preventDefault()
        setShowDropdown1(true);
    };

    let timeoutId;
    const hideDropdown1 = (e) => {
        e.preventDefault();
        timeoutId = setTimeout(() => {
            setShowDropdown1(false);
        }, 500); // Delay of 500 milliseconds (adjust as needed)
    };

    const cancelHideDropdown = () => {
        clearTimeout(timeoutId);
    };
    
    const toggleDropdown2 = (e) => {
        e.preventDefault();
        setShowDropdown2(!showDropdown2);
    };

    

    const notifySubscription = () =>{
        
        setShowSubscriptionModal(true);
    };

    const closePopup =() => {
        setShowSubscriptionModal(false);
    }

    const handleSubscription =() => {
        setShowSubscriptionModal(false);
        if (!isAuthenticated){
            navigate('login')
        }else{

            console.log(isAuthenticated);
            const amount = 100;
            const type = 'subscription';
            const note='Subscribe to access premium features';
            navigate('/payment', { state: { amount,  type, note } });
        }
    }

    // const toggleMenu = () => {
    //     setShowMenu(!showMenu); 
    // };

    const handleLogout = () => {
        localStorage.clear();
    }

    

    


    return (
        <div>
            <header className="header-area header-sticky" >
                <div className="container-fluid"  >
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav" style={{border:'',backgroundColor:'black'}}>
                                <a href="/" class="logo">
                                    <img src="assets/images/ESCROWPS_logo.png" alt=""/>
                                </a>
                                
                                <ul className="nav" style={{color:'white'}}>
                                    <li><a href="/" className={page_now==='home' && 'active' } style={{color:'white'}}>Home</a></li>
                                    <li><a className={page_now==='explore' && 'active' }  href="/products">Explore</a></li>
                                    {(subscriber === 'true') ? (
                                        <>
                                            <li><a className={page_now==='chat' && 'active' } href="/chat"  style={{color:'white'}}>Chats</a></li>
                                            
                                            <li>
                                                <a ref={dropdownRef} className={`nav-item dropdown ${page_now === 'bids' && 'active'}`}  style={{color:'white', cursor:'pointer'}} onMouseEnter={viewDropdown1} onMouseLeave={hideDropdown1}>
                                                    Weekly Auction
                                                </a>
                                                <ul className={`dropdown-menu auction ${showDropdown1 ? 'show' : ''}`} aria-labelledby="navbarDropdown" onMouseEnter={cancelHideDropdown} onMouseLeave={hideDropdown1} style={{ backgroundColor: 'aqua', position: 'absolute', marginLeft:'35rem',  width: '1em' }}>
                                                    <li ><a className="dropdown-item custom-drop-item" style={{cursor:'pointer'}} href="/bids">View</a></li>
                                                    <li ><a className="dropdown-item custom-drop-item" style={{cursor:'pointer'}} href="/bookbids">book Now</a></li>
                                                </ul>
                                            </li>
                                            <li>
                                            
                                            </li>
                                            <li><a className={page_now==='cart' && 'active' } href="/cart" style={{color:'white'}}>Cart</a></li>
                                        </>
                                    ):(
                                        <>
                                            <li><a onClick={notifySubscription}  style={{color:'white', cursor:'pointer'}}>
                                            <img src='../assets/images/locked.png' alt='Your Chats Image' style={{ width: '15px', marginLeft: 'auto', marginRight: '6px', marginBottom:'6px' }} />
                                                Chats
                                            </a></li>
                                            
                                            <li><a  onClick={notifySubscription} style={{color:'white', cursor:'pointer'}}>
                                            <img src='../assets/images/locked.png' alt='Your Chats Image' style={{ width: '15px', marginLeft: 'auto', marginRight: '6px', marginBottom:'6px' }} />
                                            Weekly Auction
                                            </a></li>
                                            <li><a  onClick={notifySubscription} style={{color:'white', cursor:'pointer'}}>
                                            <img src='../assets/images/locked.png' alt='Your Chats Image' style={{ width: '15px', marginLeft: 'auto', marginRight: '6px', marginBottom:'6px' }} />
                                                Cart
                                            </a></li>
                                        </>
                                    )}
                                    
                                    {isAuthenticated ? (
                                        <li className="nav-item dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" aria-expanded={showDropdown} style={{color:'white'}}>
                                                {username}
                                            </a>
                                            <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`} aria-labelledby="navbarDropdown" style={{backgroundColor:'aqua', marginTop:'0px'}}>
                                                {isAdmin === 'true' ? (
                                                    <li style={{width:'100%'}}><a className="dropdown-item custom-drop-item" href="/admin_dashboard">Admin Dashboard</a></li>
                                                ) : ''}
                                                
                                                {isSeller === 'true' ? (
                                                    <li style={{width:'100%'}}><a className="dropdown-item custom-drop-item" href="/seller_dashboard">Seller Dashboard</a></li>
                                                ) : (
                                                    <li style={{width:'100%'}}>
                                                        <a className="dropdown-item custom-drop-item" href="/become_seller">I Want to Sell</a>
                                                    </li>
                                                )}
                                                
                                                <li style={{width:'100%'}}><a className="dropdown-item custom-drop-item  " href="/" onClick={handleLogout}>Logout</a></li>
                                            </ul>
                                        </li>
                                    ) : (
                                        <li><a className={page_now==='login' && 'active' } href="/login" style={{color:'white'}}>Login</a></li>
                                    )}
                                    {/* <li><a href="/login">Login</a></li> */}
                                    <a style={{marginTop:'6px'}}>{currentTime}</a>
                                </ul>   
                                {/* <a className='menu-trigger'>
                                    <span>Menu</span>
                                </a> */}
                                <a className="dropdown-toggle menu-trigger" href="#" id="navElementsForSM" role="button" onClick={toggleDropdown2} aria-expanded={showDropdown2}>
                                    <span></span>
                                </a>
                                <ul className={`dropdown-menu dropdown-menu-end ${showDropdown2 ? 'show' : ''}`} aria-labelledby="navElementsForSM" style={{ backgroundColor: 'aqua',  marginTop: '0px', right: '0', left: 'auto' }}>
                                    <li style={{ width: '100%' }}><a className="dropdown-item custom-drop-item" href="#">Profile</a></li>
                                    <li style={{ width: '100%' }}><a className="dropdown-item custom-drop-item" href="#" onClick={handleLogout}>Logout</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            
            


            <main>
                {/* <div className="container-fluid" style={{ paddingTop: '8em',  minHeight: '610px', backgroundImage: `url(${require('../assets/images/banner-bg.jpg')})`, display: 'flex', justifyContent: 'center', alignItems: 'top' }}>   */}
                {/* <div className="container-fluid" style={{ paddingTop: '8em',  minHeight: '610px', backgroundImage: `url(${require('../assets/images/mapbackground.jpg')})`, display: 'flex', justifyContent: 'center', alignItems: 'top' }}> */}
                
                <div className="container-fluid" style={{ paddingTop: '8em',  minHeight: '100vh', backgroundImage: `url(${require('../assets/images/my_connection_to_the_world_by_dnacron_d2gd4ct.gif')})`, display: 'flex', justifyContent: 'center', alignItems: 'top' }}>
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
                {children}
                </div>
            </main>


            {/* <footer>
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <p>Copyright © 2022 <a href="#">Liberty</a> NFT Marketplace Co., Ltd. All rights reserved.
                    &nbsp;&nbsp;
                    Designed by <a title="HTML CSS Templates" rel="sponsored" href="https://templatemo.com" target="_blank">TemplateMo</a></p>
                    </div>
                </div>
                </div>
            </footer> */}
        </div>
    );
};

export default BaseLayout;
