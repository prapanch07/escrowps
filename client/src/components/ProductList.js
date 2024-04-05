import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios' ;


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
                console.log("Fetched Products:", response.data);
            } catch (error) {
                
                console.error("Error Fetching Products:", error);
                
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        console.log("Add Product button clicked");
        // Implement your logic to add a product here
        navigate('/AddProduct');
    };

    if (products.length === 0) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h1>Product List</h1>
            <button onClick={handleAddProduct}>Add Product</button>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                    </li>
                ))}
            </ul>
            
        </div>
    );
};

export default ProductList;