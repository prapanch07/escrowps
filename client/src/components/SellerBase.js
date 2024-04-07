import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerBase = ({ children }) => {
    const username = localStorage.getItem('username');
    const user_id = localStorage.getItem('user_id');
    const isSeller = localStorage.getItem('isSeller');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    const [showSidebar, setShowSidebar] = useState(false);
    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        localStorage.setItem('isAuthenticated', false);
        localStorage.setItem('isSeller', false);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary text-white seller-navbar" style={{borderBottom:'solid black 1px', marginBottom:'0px'}}>
                <a className="navbar-brand" href="#" >Seller</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto mr-5">
                        <li className="nav-item active">
                            <a className="nav-link " href="#">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Pricing</a>
                        </li>
                       
                    </ul>
                </div>
            </nav>
            <main>
                {children}
            </main>
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <p>Copyright © 2022 
                                <a href="#">Liberty</a> NFT Marketplace Co., Ltd. All rights reserved.
                                &nbsp;&nbsp;
                                Designed by <a title="HTML CSS Templates" rel="sponsored" href="https://templatemo.com" target="_blank">TemplateMo</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
                
            
        </>
    );
};

export default SellerBase;
