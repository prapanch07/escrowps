// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './components/HomePage';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ProductDetails from './components/productDetail';

import BidsPage from './components/bidChat';
import CartPage from './components/CartPage';
import ChatPage from './components/ChatPage';
import PaymentPage from './components/PaymentPage';

import BidbookingPage from './components/BidBookingPage';

import Loginpage from './components/login';
import RegisterPage from './components/Register';
import AdminRegisterPage from './components/Adminregister';


import SellerDashboard from './components/SellerDashboard';
import SellerbidsPage from './components/SellerbidsPage';
import BecomeSeller from './components/BecomeSeller';


// import AdminrPage from './components/Admin'

// Import CSS files
import './assets/css/fontawesome.css';
import './assets/css/templatemo-liberty-market.css';
import './assets/css/owl.css';
import './assets/css/animate.css';
import AdminDashboard from './components/Admin_dashboard';

export const BACKEND_URL = 'http://localhost:5000';



function App() {
  return (
    <Router>
      <div>
        <header>
          <nav>
            
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/ProductDetails/:productId" element={<ProductDetails />} />

          <Route path="/seller_dashboard" element={<SellerDashboard />} />
          <Route path="/bids/:productId" element={<SellerbidsPage/>} />
          <Route path="/become_seller" element={<BecomeSeller />} />
          <Route path="/bids" element={<BidsPage/>} />
          <Route path='/cart' element={<CartPage/>} />
          <Route path='/chat' element={<ChatPage/>} />
          <Route path='/payment' element={<PaymentPage/>} />
          
          <Route path='/bookbids' element={<BidbookingPage/>} />

          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/adminregister' element={<AdminRegisterPage />} />

          <Route path='/admin_dashboard' element={< AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


