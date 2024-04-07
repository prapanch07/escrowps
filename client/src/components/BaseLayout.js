import React, { useState } from 'react';
// import { Dropdown } from 'react-bootstrap';
 
const BaseLayout = ({ children }) => {
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    const isSeller = localStorage.getItem('isSeller');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    console.log(isAuthenticated)
    console.log(username)
    console.log(user_id)
    console.log(isSeller)
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);

    const toggleDropdown  = (e) => {
        e.preventDefault()
        setShowDropdown(!showDropdown);
    };
    
    const toggleDropdown2 = (e) => {
        e.preventDefault();
        setShowDropdown2(!showDropdown2);
    };

    // const toggleMenu = () => {
    //     setShowMenu(!showMenu); 
    // };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('usern_id');
        localStorage.setItem('isAuthenticated', false);
        localStorage.setItem('isSeller', false)
    }

    return (
        <div>
            <header className="header-area header-sticky" >
                <div className="container-fluid"  >
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav" style={{border:'', }}>
                                <a href="index.html" class="logo">
                                    <img src="assets/images/logo.png" alt=""/>
                                </a>
                                
                                <ul className="nav" style={{color:'white'}}>
                                    <li><a href="/" className="active" style={{color:'white'}}>Home</a></li>
                                    <li><a href="/products">Explore</a></li>
                                    <li><a href="/products"  style={{color:'white'}}>Chats</a></li>
                                    <li><a href="details.html" >Legal Advisors</a></li>
                                    <li><a href="author.html" style={{color:'white'}}>Contact Us</a></li>
                                    <li><a style={{color:'white'}}>Settings</a></li>
                                    {isAuthenticated ? (
                                        <li className="nav-item dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" aria-expanded={showDropdown} style={{color:'white'}}>
                                                {username}
                                            </a>
                                            <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`} aria-labelledby="navbarDropdown" style={{backgroundColor:'aqua', marginTop:'0px'}}>
                                                {isSeller === 'true' ? (
                                                    <li style={{width:'100%'}}><a className="dropdown-item custom-drop-item" href="/seller_dashboard">Seller Dashboard</a></li>
                                                ) : (
                                                    <li style={{width:'100%'}}><a className="dropdown-item custom-drop-item" href="/become_seller">I Want to Sell</a></li>
                                                )}
                                                <li style={{width:'100%'}}><a className="dropdown-item custom-drop-item" href="/" onClick={handleLogout}>Logout</a></li>
                                            </ul>
                                        </li>
                                    ) : (
                                        <li><a href="/login" style={{color:'white'}}>Login</a></li>
                                    )}
                                    {/* <li><a href="/login">Login</a></li> */}
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
                <div className="container-fluid" style={{ paddingTop: '8em',  minHeight: '610px', backgroundImage: `url(${require('../assets/images/mapbackground.jpg')})`, display: 'flex', justifyContent: 'center', alignItems: 'top' }}>
                         
                {children}
                </div>
            </main>


            <footer>
                <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                    <p>Copyright © 2022 <a href="#">Liberty</a> NFT Marketplace Co., Ltd. All rights reserved.
                    &nbsp;&nbsp;
                    Designed by <a title="HTML CSS Templates" rel="sponsored" href="https://templatemo.com" target="_blank">TemplateMo</a></p>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
};

export default BaseLayout;