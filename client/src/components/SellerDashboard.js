import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import SellerBase from './SellerBase';
import { useNavigate } from 'react-router-dom';


const user_id = localStorage.getItem('user_id')
const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [unsoldproducts, setUnsoldproducts] = useState([]);
  const [soldproducts, setSoldproducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    price: '',
    image: null,
    descripton: '',
    patentno: ''
  });
  const [descriptionError, setDescriptionError] = useState('');
  const [showPurCard, setShowPurCard] = useState(false);
  const [sel_product, setSel_product] = useState();
  const [upcomingBidDays, setUpcomingBidDays] = useState([])
  const [bidday, setBidday] = useState('');
  const [openingBid, setOpeningBid] = useState('');
  const [reenteredBid, setReenteredBid] = useState('');
  const [selectedBiddingDate, setSelectedBiddingDate] = useState('');
  const [disableContinue, setDisableContinue] = useState(true);
  const navigate = useNavigate();


  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products/user/${user_id}`);
      setProducts(response.data);
      console.log('products', response.data)
      const unsoldproducts = response.data.filter(product => !product.isSold);
      const soldproducts = response.data.filter(product => product.isSold);
      console.log('Unsold products:', unsoldproducts);
      console.log('sold products:', soldproducts);
      setUnsoldproducts(unsoldproducts);
      setSoldproducts(soldproducts);
    } catch (error) {

      console.error("Error Fetching Products:", error);

    }
  };
  useEffect(() => {

    fetchProducts();
  }, []);

  const handleDescriptionChange = (event) => {
    const inputValue = event.target.value;
    setFormData({
      ...formData,
      description: inputValue
    });

    const minChars = 50;
    if (inputValue.length < minChars) {
      setDescriptionError(`Minimum ${minChars} characters required.`);
    } else {
      setDescriptionError('');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      image: event.target.files[0]
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('ownerName', formData.ownerName);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('userId', localStorage.getItem('user_id'));
      formDataToSend.append('patentNo', formData.patentno)
      const response = await axios.post(`${BACKEND_URL}/api/products`, formDataToSend);
      console.log('Product added successfully:', response.data);

      setFormData({
        name: '',
        ownerName: '',
        price: '',
        image: null,
        description: '', 
        patentno: ''
      });
    } catch (error) {
      // Handle error
      console.error('Error adding product:', error);
    }
  };

  const seeBids = (productId) => {
    navigate(`/bids/${productId}`);
  }

  const createBidRoom = async (productId) => {
    try {
      navigate('/seller_dashboard');
      const response = await axios.get(`${BACKEND_URL}/api/bids/BidDays`);
      setBidday(response.data.day)
      setUpcomingBidDays(response.data.firstFiveBidDays)
      const s_product = products.find(product => product._id === productId);
      setSel_product(s_product)
      setShowPurCard(true);

    } catch (error) {
      console.error("Error Creating bid room", error);
    }
  }

  const continueBidopen = async () => {
    console.log('Continue clicked');
    console.log('Opening bid:', openingBid);
    const parsedDate = new Date(selectedBiddingDate);
    parsedDate.setDate(parsedDate.getDate() - 1);
    const type = 'bidbooking_seller';
    const amount = 100;
    const note = 'Make the payment to book bid';
    const productid = sel_product._id;

    console.log('Bidding date:', parsedDate);
    navigate('/payment', { state: { amount, type, note, openingBid, parsedDate, productid } });
  };


  const delete_product = async (productId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this product?");
      if (!confirmed) return;
      await axios.delete(`${BACKEND_URL}/api/products/${productId}`);

      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const closeBidding = async (productId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to clsose bidding this product?");
      if (!confirmed) return;
      await axios.put(`${BACKEND_URL}/api/products/closebidding/${productId}`);
      console.log('bidding closed')
      window.location.reload();
    } catch (error) {
      console.error('Error closing bid', error)
    }
  }

  const closePurCard = async () => {
    setShowPurCard(false);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day - 1}-${month}-${year}`;
  };
  const handleOpeningBidChange = (event) => {
    setOpeningBid(event.target.value);
    validateBids(event.target.value, reenteredBid);
  };
  const handleReenteredBidChange = (event) => {
    setReenteredBid(event.target.value);
    validateBids(openingBid, event.target.value);
  };
  const validateBids = (openingBid, reenteredBid) => {
    if (openingBid === reenteredBid) {
      setDisableContinue(false);
    } else {
      setDisableContinue(true);
    }
  };



  console.log(sel_product)
  console.log('bidday', bidday)
  console.log('upcomingBidDays', upcomingBidDays)

  return (
    <SellerBase>
      {showPurCard && (
        <div className="popup-container ">
          <div className="popup-content text-center">
            <div className="row pur_card" style={{ width: '70em' }}>
              <div className="col-3 " style={{ borderBottom: 'solid 1px' }}>
                <img src={`${BACKEND_URL}/${sel_product.image}`} style={{ width: '12em', height: '10em' }}></img>
              </div>
              <div className="col-9 py-1" style={{ borderBottom: 'solid 1px', borderRight: 'solid 1px', textAlign: 'left' }}>
                <h6 style={{ color: 'black', marginTop: '2em' }}>Patent Name : {sel_product.name}</h6>
                <h6 style={{ color: 'black', marginTop: '1em' }}>Patented to: {sel_product.ownerName}</h6>

                <h6 style={{ color: 'black', marginTop: '1em' }}>Patented date: {formatDate(sel_product.updatedAt)}</h6>
              </div>
              <div className="col-12 mt-2 p-2" style={{ borderBottom: 'solid 1px', borderRight: 'solid 1px' }}>
                <div className='row' >
                  <p className='col-3' >Bidding date</p>
                  <select
                    style={{ border: 0, borderBottom: 'solid 1px ', height: '2em', width: '40em' }}
                    onChange={(e) => setSelectedBiddingDate(e.target.value)}
                    value={selectedBiddingDate}
                  >
                    <option>--------------</option>
                    {upcomingBidDays.map((bidDay, index) => {
                      const parsedDate = new Date(bidDay);
                      return <option key={index} value={parsedDate}>{formatDate(parsedDate)}</option>;
                    })}
                  </select>
                </div>
                <div className='row' >
                  <p className='col-3' >Opening bid</p>
                  <input
                    type='text'
                    value={openingBid}
                    onChange={handleOpeningBidChange}
                    style={{ border: 0, borderBottom: 'solid 1px ', height: '2em', width: '40em' }}
                  ></input>
                </div>
                <div className='row'>
                  <p className='col-3'>Re enter Opening bid</p>
                  <input
                    type='text'
                    value={reenteredBid}
                    onChange={handleReenteredBidChange}
                    style={{ border: 0, borderBottom: 'solid 1px ', height: '2em', width: '40em' }}
                  ></input>
                </div>
              </div>
              <div className="col-12 mt-2 p-2" style={{ borderBottom: 'solid 1px', borderRight: 'solid 1px' }}>
                <div className='col-12' style={{ textAlign: 'left' }}>
                  <h6 style={{ color: 'black', marginLeft: '2em' }}>Price Details</h6>
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
              <button disabled={disableContinue} className='btn btn-success btn-sm mx-auto' onClick={continueBidopen}>Continue</button>
              <button onClick={closePurCard} className='btn btn-danger btn-sm'>Close</button>
            </div>

          </div>

        </div>
      )}


      <section style={{ backgroundColor: 'rgb(238, 214, 214)', marginTop: '0px' }} id='addproduct'>
        <div className='container seller-container text-ceter'>
          <h2 style={{ color: 'black' }}>Add Your Patent</h2>
          <form onSubmit={handleSubmit}>
            <div className='row mt-4'>
              <div className='col-md-6'>
                <div className='col-12 my-2'>
                  <input
                    type='text'
                    name="name"
                    placeholder='Enter Your product name'
                    className='form-control'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='col-12 my-2'>
                  <input
                    type='text'
                    name="ownerName"
                    placeholder='Enter owner name'
                    className='form-control'
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/*  */}
                <div className='col-12 my-2'>
                  <input
                    type="number"
                    name="patentno"
                    placeholder='Patent No'
                    className='form-control'
                    value={formData.patentno}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/*  */}
                <div className='col-12 my-2'>
                  <input
                    type='number'
                    name="price"
                    placeholder='Expected minimum price'
                    className='form-control'
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='col-12 row my-2'>
                  <div className='col-6'>
                    <label htmlFor="image" className="custom-file-label ml-3" style={{ display: showPurCard ? 'none' : 'block' }}>Image</label>
                    <input
                      type='file'
                      id='image'
                      name='image'
                      className="custom-file-input"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                  <div className='col-6 d-flex align-items-center'>
                    <button type='submit' className='btn btn-secondary ml-auto'>Submit</button>
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className='col-12 my-2'>
                  <textarea
                    name="description"
                    placeholder='Describe the product'
                    rows="7"
                    cols="50"
                    className='form-control'
                    id="descriptionTextarea"
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    required
                  ></textarea>
                  {descriptionError && <p className="text-danger">{descriptionError}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section style={{ backgroundColor: 'rgb(130, 214, 214)', marginTop: '0px' }} id='added_product'>
        <div className='container seller-container text-ceter mb-0' >
          <h3 className='text-dark mt-3'>Your Patents</h3>
          <table className='table table-border mt-4' >
            <thead>
              <tr>
                <th>SiNo</th>
                <th></th>
                <th>Product Name</th>
                <th>Owner Name</th>
                <th>Price</th>
                <th>Description</th>
                <th >Bids</th>
                <th></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Here you can map through the products state to display each product */}
              {unsoldproducts.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {/* Replace placeholders with actual product data */}
                  <td><img src={`${BACKEND_URL}/${product.image}`} alt="product" style={{ width: '5em', borderRadius: '4px' }} /></td>
                  <td>{product.name}</td>
                  <td>{product.ownerName}</td>
                  <td>{product.price}</td>
                  <td style={{ maxWidth: '10em' }}>{product.description.slice(0, 50)}</td>
                  <td>
                    {product.allow_bids ?
                      (
                        <div className='text-center'>
                          <h6 className='live-blink'>Live now</h6>
                          <a
                            className='btn btn-outline-danger btn-sm'
                            style={{ fontWeight: 'bolder', border: '0', fontSize: 'small' }}
                            onClick={() => closeBidding(product._id)}
                          >

                            Close Bidding
                          </a>

                        </div>
                      ) : (
                        <button
                          href='/sellerbids'
                          className='btn btn-outline-primary btn-sm '
                          style={{ fontWeight: 'bold', border: '0', fontSize: 'small' }}
                          onClick={() => createBidRoom(product._id)}
                        >
                          Open for Bids
                        </button>
                      )}

                  </td>
                  <td>
                    <button
                      href='/sellerbids'
                      className='btn btn-outline-secondary btn-sm '
                      style={{ fontWeight: 'bold', border: '0', fontSize: 'small' }}
                      onClick={() => seeBids(product._id)}
                    >
                      View Bids
                    </button>
                  </td>
                  <td className='row' style={{ maxWidth: '6em' }}>
                    <a className='col-6 btn btn-outline-primary btn-sm' style={{ border: '0' }}>✏️ </a>
                    <a onClick={() => delete_product(product._id)} className='col-6  btn btn-outline-danger btn-sm' style={{ border: '0' }}>🗑️ </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>



          {soldproducts.length > 0 &&
            <>
              <h5 className='text-dark mt-5' style={{ borderTop: 'solid 1px' }}>solded Patents </h5>
              <table className='table table-border mt-4' >
                <thead>
                  <tr>
                    <th>SiNo</th>
                    <th></th>
                    <th>Product Name</th>
                    <th>Owner Name</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th >Bids</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Here you can map through the products state to display each product */}
                  {soldproducts.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {/* Replace placeholders with actual product data */}
                      <td><img src={`${BACKEND_URL}/${product.image}`} alt="product" style={{ width: '5em', borderRadius: '4px' }} /></td>
                      <td>{product.name}</td>
                      <td>{product.ownerName}</td>
                      <td>{product.price}</td>
                      <td style={{ maxWidth: '10em' }}>{product.description.slice(0, 50)}</td>

                      <td>
                        <button
                          href='/sellerbids'
                          className='btn btn-outline-secondary btn-sm '
                          style={{ fontWeight: 'bold', border: '0', fontSize: 'small' }}
                          onClick={() => seeBids(product._id)}
                        >
                          View Bids
                        </button>
                      </td>
                      <td className='row' style={{ maxWidth: '6em' }}>
                        {/* <a className='col-6 btn btn-outline-primary btn-sm' style={{border:'0'}}>✏️ </a> */}
                        <a onClick={() => delete_product(product._id)} className='col-6  btn btn-outline-danger btn-sm' style={{ border: '0' }}>🗑️ </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          }
        </div>
      </section>
    </SellerBase>
  );
};

export default SellerDashboard;
