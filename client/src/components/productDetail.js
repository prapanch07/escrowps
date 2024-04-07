import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios' ;
import BaseLayout  from './BaseLayout';
import { BACKEND_URL } from '../App';


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
                // console.log("Fetched Products:", response.data);
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
        <BaseLayout>
        <div className="container-fluid det_container">
            <div className="container" style={{padding : '1em'}}>
                <div className="row mt-5">
                    <div className="col-md-6 mb-0" >
                        <h1>{product.name}</h1>
                        <p>patent to {product.ownerName}</p>
                        <p>Seller: {product.seller.fullname}</p>
                        <p className="pt-4" style={{minHeight:'150px'}}>{product.description}</p>

                        <h3 className="pt-4 ">Price: {product.price}</h3>
                        <div className="row">
                            <div className="ml-auto mt-4">
                                <a className="btn btn-outline-success det_button">Bid now</a>
                            </div>
                            <div className="ml-auto mt-4 mr-auto">
                            <a className="btn btn-outline-primary  det_button">Chat</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6" style={{backgroundColor:'white'}}>
                        <img src={`${BACKEND_URL}/${product.image}`} alt={product.name} className="card-img-top" style={{ width:'100%' }} />
                    </div>
                    
                </div>
            {/* <button onClick={handleAddProduct}>Add Product</button> */}
            
                
                
                
            </div>
            
        </div>
        </BaseLayout>


        
    );
};

export default ProductDetails;