import react from 'react';
 
const BaseLayout = ({ children }) => {
    return (
        <div>
            <header className="header-area header-sticky" >
                <div className="container-fluid"  >
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav" style={{  backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius:'20px'  }}>
                                <a href="index.html" class="logo">
                                    <img src="assets/images/logo.png" alt=""/>
                                </a>
                                
                                <ul className="nav">
                                    <li><a href="index.html" className="active">Home</a></li>
                                    <li><a href="explore.html">Explore</a></li>
                                    <li><a href="details.html">Item Details</a></li>
                                    <li><a href="author.html">Author</a></li>
                                    <li><a href="/login">Login</a></li>
                                </ul>   
                                <a className='menu-trigger'>
                                    <span>Menu</span>
                                </a>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>


            <main>{children}</main>


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