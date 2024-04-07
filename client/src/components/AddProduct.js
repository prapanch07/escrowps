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
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload  = (e) => {
        const file = e.target.files[0];
        setImage(file)
    };
 
    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', parseFloat(price));
        formData.append('category', category);
        formData.append('brand', brand);
        formData.append('quantity_left', parseInt(quantityLeft));
        formData.append('image', image);

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        console.log('FormData:', formData);

        try {
            const response = await axios.post('http://localhost:5000/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
                <input type="file" onChange={handleImageUpload} required />
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;