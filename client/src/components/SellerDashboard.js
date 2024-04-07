import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import SellerBase from './SellerBase';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    price: '',
    image: null,
    description: ''
  });
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    // Fetch products or any other initial data
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
      // Send form data to backend
      const response = await axios.post(`${BACKEND_URL}/api/products`, formDataToSend);
      // Handle success
      console.log('Product added successfully:', response.data);

      // Optionally, you can reset the form after successful submission
      setFormData({
        name: '',
        ownerName: '',
        price: '',
        image: null,
        description: ''
      });
    } catch (error) {
      // Handle error
      console.error('Error adding product:', error);
    }
  };

  return (
    <SellerBase>
      <section style={{ backgroundColor: 'rgb(238, 214, 214)', marginTop: '0px' }} id='addproduct'>
        <div className='container seller-container text-ceter'>
          <h2 style={{ color: 'black' }}>Add Your Products</h2>
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
                    <label htmlFor="image" className="custom-file-label ml-3">Image</label>
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
        <div className='container seller-container text-ceter '>
          <h2 className='text-dark mt-3'>Products Added by you</h2>
          <table className='table table-border mt-4'>
            <thead>
              <tr>
                <th>SiNo</th>
                <th></th>
                <th>Product Name</th>
                <th>Owner Name</th>
                <th>Price</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Here you can map through the products state to display each product */}
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {/* Replace placeholders with actual product data */}
                  <td><img src={product.image} alt="product" /></td>
                  <td>{product.name}</td>
                  <td>{product.ownerName}</td>
                  <td>{product.price}</td>
                  <td>{product.description}</td>
                  <td>
                    {/* Add buttons or actions for each product */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SellerBase>
  );
};

export default SellerDashboard;
