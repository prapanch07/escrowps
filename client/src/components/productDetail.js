import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios' ;


const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async() => {
            try {
                
                // const response = await axios.get('http://localhost:5000/api/products/${productId}');
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setProduct(response.data);
                console.log("Fetched Products:", response.data);
            } catch (error) {
                
                console.error("Error Fetching Products:", error);
                
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddProduct = () => {
        console.log("Add Product button clicked");
        // Implement your logic to add a product here
        navigate('/AddProduct');
    };

    if (!product) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h1>Product Details</h1>
            
            <button onClick={handleAddProduct}>Add Product</button>
            <div className="container" style={{padding : '5em'}}>
                <h2 style={{ color: 'black' }}>{product.name}</h2>
                <p  style={{ color: 'black' }}>{product.description}</p>
                <p style={{ color: 'black' }}>Price: {product.price}</p>
            </div>
            <img src={product.image} alt={product.name} className="card-img-top" style={{ width: '20%'}} /> {/* Image */}
        </div>
    );
};

export default ProductDetails;