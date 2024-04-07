// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './components/HomePage';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ProductDetails from './components/productDetail';
import Loginpage from './components/login';
import RegisterPage from './components/Register';
import SellerDashboard from './components/SellerDashboard';
import BecomeSeller from './components/BecomeSeller';

import AdminrPage from './components/Admin'

// Import CSS files
import './assets/css/fontawesome.css';
import './assets/css/templatemo-liberty-market.css';
import './assets/css/owl.css';
import './assets/css/animate.css';
export const BACKEND_URL = 'http://localhost:5000';



function App() {
  return (
    <Router>
      <div>
        <header>
          <nav>
            {/* <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
            </ul> */}
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/ProductDetails/:productId" element={<ProductDetails />} />

          <Route path="/seller_dashboard" element={<SellerDashboard />} />
          <Route path="/become_seller" element={<BecomeSeller />} />

          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={<AdminrPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


