import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [quantityLeft, setQuantityLeft] = useState('');
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const newProduct = {
            name,
            description,
            price: parseFloat(price),
            category,
            brand,
            quantity_left: parseInt(quantityLeft),
            image
        };

        try {
            const response = await axios.post('http://localhost:5000/api/products', newProduct);
            console.log('Product added:', response.data);
            // After adding the product, navigate to the product list page
            navigate('/products');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div>
            <h1>Add Product</h1>
            <form onSubmit={handleAddProduct}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <label>Category:</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                <label>Brand:</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                <label>Quantity Left:</label>
                <input type="number" value={quantityLeft} onChange={(e) => setQuantityLeft(e.target.value)} required />
                <label>Image:</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;