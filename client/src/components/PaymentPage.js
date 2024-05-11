import React, { useState, useEffect } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../App";
import BaseLayout from "./BaseLayout";

const PaymentPage =() => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state)
    const userId = localStorage.getItem('user_id');
    const {amount, type,  cart_id, bidroomId, bidId, note,openingBid, parsedDate,productid } = location.state;

    const [cardNumber, setCardNumber] = useState('');
    const [validThrough, setValidThrough] = useState('');

    const [showUPIInput, setShowUPIInput] = useState(false);
    const [showCardInput, setShowCardInput] = useState(false);
    const [showBankInput, setShowBankInput] = useState(false);

    const [validupi, setValidupi] = useState(false);
    const [validcard, setValidcard] = useState(false);

    console.log('amount: ',amount ,'type: ',type, 
                'cart_id:',cart_id, 'bidroomId: ',bidroomId, 
                'bidId: ',bidId, 'note: ',note, 'openingBid: ',openingBid,
                'parsedDate: ',parsedDate, 'productid', productid)

    const toggleUPIInput = () => {
        setShowUPIInput(!showUPIInput);
        setShowCardInput(false); 
        setShowBankInput(false);
    }

    const toggleCardInput = () => {
        setShowCardInput(!showCardInput);
        setShowUPIInput(false); 
        setShowBankInput(false);
    }

    const toggleBankInput = () => {
        setShowBankInput(!showBankInput);
        setShowUPIInput(false); 
        setShowCardInput(false);
    }

    

    const validateUPI = () => {
        const upiInputValue = document.getElementById("upi-input").value.trim();
        const upiRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
        setTimeout(() => {
            if (upiRegex.test(upiInputValue)) {
                setValidupi(true);
            } else {
                setValidupi(false);
            }
        }, 3000);
    }

    const validateCard  = () => {
        const cardNumberElement = document.getElementById("card-number");
        const cardNumber = cardNumberElement.value.replace(/\s/g, '').trim();
        const cardHolderName = document.getElementById("card-holder-name").value.trim();
        const validThrough = document.getElementById("valid-through").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        console.log(cardNumber, cardHolderName, validThrough, cvv)

        const cardNumberRegex = /^\d{16}$/; // 16-digit card number
        const cardHolderNameRegex = /^[a-zA-Z\s]+$/; // Only alphabets and spaces allowed
        const validThroughRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
        const cvvRegex = /^\d{3}$/; // 3-digit CVV number

        const isCardNumberValid = cardNumberRegex.test(cardNumber);
        const isCardHolderNameValid = cardHolderNameRegex.test(cardHolderName);
        const isValidThroughValid = validThroughRegex.test(validThrough);
        const isCVVValid = cvvRegex.test(cvv);

        setTimeout(() => {
            if (isCardNumberValid && isCardHolderNameValid && isValidThroughValid && isCVVValid) {
                setValidcard(true)
            } else {
                setValidcard(false)
            }
        }, 3000);

        console.log(isCardNumberValid, isCardHolderNameValid, isValidThroughValid, isCVVValid)
    }

    const formatCardNumber = (value) => {
        const formattedValue = value.replace(/\s/g, '');
        return formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    }

    const handleInputcardChange = (event) => {
        const inputValue = event.target.value;
        const formattedValue = formatCardNumber(inputValue);
        setCardNumber(formattedValue);
    }

    const formatValidThrough = (value) => {
        const formattedValue = value.replace(/\//g, '');
        return formattedValue.replace(/(\d{2})(\d{0,2})/, '$1/$2').trim();
    }

    const handleInputvalidChange = (event) => {
        const inputValue = event.target.value;
        const formattedValue = formatValidThrough(inputValue);
        setValidThrough(formattedValue);
    }

    const makePayment = async () => {
        try {
            if (type === 'bidcart') {
                navigate('/cart'); 
                await axios.put(`${BACKEND_URL}/api/payment/bidcart`, { cart_id: cart_id });
            } else if (type === 'normalcart') {
                navigate('/cart');
                await axios.put(`${BACKEND_URL}/api/payment/normalcart`, { cart_id: cart_id });
            } else if (type === 'bidbooking' ) {
                console.log('bidroomId; ',bidroomId)
                console.log(userId)
                console.log('userId')
                
                await axios.put(`${BACKEND_URL}/api/payment/bookbid`, { bidroomId: bidroomId, userId: userId });
                navigate('/bookbids');
            } else if (type === 'subscription') {
                console.log('type: ',type);
                const respone = await axios.put(`${BACKEND_URL}/api/payment/makesubscriber`, { userId: userId });
                console.log(respone.data.success)
                localStorage.setItem('subscriber', respone.data.success);
                navigate('/')
            } else if (type === 'bidpurchase'){
                console.log('type: ',type);
                console.log('bidid: ', bidId)
                const respone = await axios.put(`${BACKEND_URL}/api/payment/bidpurchase`, { bidId: bidId });
                navigate('/bookbids')
            } else if (type === 'bidbooking_seller'){
                const respone = await axios.post(`${BACKEND_URL}/api/payment/creatBidroom`, 
                { openingBid:openingBid, biddingdate:parsedDate, productid:productid });
                navigate('/seller_dashboard')
            }
            
                
            

        } catch (error) {
            console.log("Error handling payment", error);
        }
    };
    
    
    return(
        <BaseLayout>
            <div className="mb-4" style={{display: 'block',  width:'90%'}}>
                <div className="container p-cont" style={{ height:'16em', width:'100%'}}>
                    <div className="row">
                        <div className="col-6">
                            <h2>payment Page</h2>
                            <img className="mt-4" src="assets/images/ESCROWPS_logo.png" alt=""/>
                        </div>
                        <div className="col-6 in-cont" style={{ height: 'auto'}}>
                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
                                <p className="ml-auto">{note}</p>
                                <h4 className="ml-auto" style={{margin: 0, alignSelf: 'flex-end'}}>To be paid Now</h4>
                                <h3 style={{fontSize: '40px', margin: 0, alignSelf: 'flex-end'}}>{amount}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="container " style={{width:'90%'}}>
                        <div className="row mb-2">    
                            <div className="col-5 payment-types" onClick={toggleUPIInput}>
                                <img className="mx-auto" src="assets/images/upi.png" alt="" />
                            </div>
                            <div className="col-7 payment-types "  onClick={toggleUPIInput}>
                                <a className="mx-auto"><h3>Pay by UPI </h3></a>
                            </div>
                            <div className={`col-12 pay  ${showUPIInput ? 'show' : ''}`} id="upi">
                                <div className="row p-4 mt-4" style={{ width:'100%'}}>
                                    <div className="col-1"></div>
                                    <h2  className="ml-auto col-4 ">ENTER UPI ID</h2> <br/>
                                    <input type="text" id="upi-input" className="input_box col-7" ></input>
                                    <div className="col-12 my-4">
                                        <div className="row">
                                            <div className="col-3"></div>
                                            <div className="col-3 mb-4">
                                                <a className="btn btn-primary ml-auto" onClick={validateUPI} style={{width:'6em'}}> {validupi ? 'verified' : 'verify'}</a>
                                            </div>
                                            <div className="col-3 mb-3">
                                                {validupi && (
                                                    <a className="btn btn-success ml-auto" style={{width:'6em'}} onClick={makePayment}>Pay {amount}</a>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">    
                            <div className="col-5 payment-types" onClick={toggleCardInput}>
                            <img className="mx-auto" src="assets/images/creditcard.png" alt="" />
                            </div>
                            <div className="col-7 payment-types " onClick={toggleCardInput}>
                                <a className="mx-auto"><h2>Credit/Debit/ATM card </h2></a>
                            </div>
                            <div className={`col-12 pay  ${showCardInput ? 'showcard' : ''}`} id="card">
                                <div className="row p-4" style={{ width:'100%', marginTop:'5em'}}>
                                    <div className="col-1"></div>
                                    <input 
                                        type="text" 
                                        className="input_box col-9" 
                                        placeholder="Enter card number"
                                        onChange={handleInputcardChange}
                                        id="card-number"
                                        value={cardNumber}
                                    />
                                    <div className="col-2"></div>

                                    <div className="col-1"></div>
                                    <input 
                                        type="text" 
                                        className="input_box col-9 mt-3" 
                                        placeholder="Card Holders Name"
                                        id="card-holder-name"
                                    />
                                    <div className="col-2"></div>

                                    <div className="col-1"></div>
                                    <input 
                                        type="text" 
                                        className="input_box col-5 mt-3" 
                                        placeholder="Valid through (MM/YY)"
                                        id="valid-through"
                                        value={validThrough}
                                        onChange={handleInputvalidChange}
                                    />
                                    <div className="col-1"></div>
                                    <input                          
                                        type="text" 
                                        className="input_box col-3 mt-3" 
                                        placeholder="CVV"
                                        id="cvv"
                                    />

                                    

                                    <div className="col-12 my-4" >
                                        <div className="row">
                                            <div className="col-3"></div>
                                            <div className="col-3">
                                                <a className="btn btn-primary ml-auto" style={{width:'6em', marginBottom:'5em'}} onClick={validateCard }>{validcard ? 'verified' : 'verify'}</a>
                                            </div>
                                            <div className="col-3">
                                                {validcard && (
                                                <a className="btn btn-success ml-auto" style={{width:'6em', marginBottom:'5em'}} onClick={makePayment}>Pay {amount}</a>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">    
                            <div className="col-5 payment-types" onClick={toggleBankInput}>
                            <img className="mx-auto" src="assets/images/bank.png" alt="" />
                            </div>
                            <div className="col-7 payment-types " onClick={toggleBankInput}>
                                <a className="mx-auto"><h2>Net Banking</h2></a>
                            </div>
                            <div className="col-12" id="bank">
                                <div className={`col-12 pay  ${showBankInput ? 'show' : ''}`}>
                                    <div className="row p-4" style={{ width:'100%'}}>
                                        <div className="col-4 text-center" >
                                            <img className=" bank-img" src="assets/images/hdfc.png" alt="" />
                                        </div>
                                        <div className="col-6 text-center d-flex align-items-center justify-content-center" style={{  height: '5em' }}>
                                            <h3>HDFC Bank</h3>
                                        </div>
                                        <div className="col-2 text-center d-flex align-items-center justify-content-center" style={{  height: '5em' }}>
                                            <a><p>Pay {amount} on website</p></a>
                                        </div>
                                    </div>
                                </div>

                                <div className={`col-12 pay  ${showBankInput ? 'show' : ''}`}>
                                    <div className="row p-4" style={{ width:'100%'}}>
                                        <div className="col-4 text-center" >
                                            <img className=" bank-img" src="assets/images/icici.png" alt="" />
                                        </div>
                                        <div className="col-6 text-center d-flex align-items-center justify-content-center" style={{  height: '5em' }}>
                                            <h3>ICICI Bank</h3>
                                        </div>
                                        <div className="col-2 text-center d-flex align-items-center justify-content-center" style={{  height: '5em' }}>
                                            <a><p>Pay {amount} on website</p></a>
                                        </div>
                                    </div>
                                </div>

                                <div className={`col-12 pay  ${showBankInput ? 'show' : ''}`}>
                                    <div className="row p-4" style={{ width:'100%'}}>
                                        <div className="col-4 text-center">
                                            <img className=" bank-img" src="assets/images/sbi.png" alt="" />
                                        </div>
                                        <div className="col-6 text-center d-flex align-items-center justify-content-center" style={{  height: '5em' }}>
                                            <h3>SBI Bank</h3>
                                        </div>
                                        <div className="col-2 text-center d-flex align-items-center justify-content-center" style={{  height: '5em' }}>
                                            <a><p>Pay {amount} on website</p></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    )
}

export default PaymentPage;