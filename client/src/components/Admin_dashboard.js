import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import AdminBase from './Admin_base';
import { useNavigate } from 'react-router-dom';



const user_id = localStorage.getItem('user_id')
const AdminDashboard = () => {
    const [products, setproducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [productlimit, setProductlimit] = useState(true);
    const [userlimit, setuserlimit] = useState(true);
    const navigate = useNavigate();
    const [showsettings, setshowsettings] = useState(false);
    const [showclrall, setShowclrall] = useState(false);
    const [showdaychange, setShowdaychange] = useState(true)
    const [currentbDay, setCurrentbDay] = useState('Not Set');
    const [currentbStartTime, setCurrentbStartTime] = useState(0);
    const [currentbCloseTime, setCurrentbCloseTime] = useState(0);
    
    

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/admin/fetchProducts`);
            setproducts(response.data); 
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    const fetchusers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/admin/fetchUsers`);
            setUsers(response.data); 
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };

    const currentbidDay =async() => {
        try{
            const response = await axios.get(`${BACKEND_URL}/api/admin/currentbidDay`)
            console.log(response.data)
            const day_identifier=response.data.biddingDay
            setCurrentbDay(response.data.dayInText)
            setCurrentbStartTime(response.data.bid_startingTime)
            setCurrentbCloseTime(response.data.bid_closingTime)
            
        }catch(error){
            console.log("Error fetching products:", error);
        }
    }

    useEffect(() => {
        fetchProducts(); 
    }, []);

    useEffect(() => {
        fetchusers(); 
    }, []);

    useEffect(() => {
        currentbidDay(); 
    }, []);

    const delete_product = async (productId) => {
        console.log('product deletion', productId );
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return; 
        }
        try{
            await axios.delete(`${BACKEND_URL}/api/admin/del_product/${productId}`);
            console.log('product deleted');
            fetchProducts();
        }catch(error){
            console.log("Error deleting products", error)
        }
        
    }

    const edit_product = async (productId) => {
        console.log('product deletion', productId )
    }

    const delete_user = async (user_id) => {
        console.log('user deletion', user_id );
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return; 
        }
        try{
            await axios.delete(`${BACKEND_URL}/api/admin/del_user/${user_id}`);
            console.log('user deleted');
            fetchusers();
        }catch(error){
            console.error("Error deleting user", error);
        }
    }

    const edit_user = async (user_id) => {
        console.log('user edit', user_id )
    }


    const hideProducts = async() =>{
        setProductlimit(true)
    }

    const showProducts = async() =>{
        setProductlimit(false)
    }

    const hideUsers = async() =>{
        setuserlimit(true);
    }

    const showUsers = async() =>{
        setuserlimit(false);
    }

    const toggoleshowsettings = async() =>{
        setshowsettings(!showsettings)
    }

    const handleClearAll =async()=>{
        setShowdaychange(false);
        setShowclrall(true)
    }

    const handleChangeBidDay=async()=>{
        setShowdaychange(true);
        setShowclrall(false)
    }

    const clearAlldata=async()=>{
        const confirmed = window.confirm("Are you sure you want to delete all data?");
         if (confirmed) {
            try{
                const response=await axios.delete(`${BACKEND_URL}/api/admin/delAll`);
                console.log(response)
            }catch(error){
                console.error("Error deleting data")
            }
        }
    }

    const changeDay = async(day) => {
        const confirmed = window.confirm("Are you sure you want to change the bidding day?");
        if (confirmed) {
            let dayintext = ''
            if (day == 1){
                dayintext='Sunday';
            }else if (day == 2){
                dayintext='Monday';
            } else if (day === 3) {
                dayintext = 'Tuesday';
            } else if (day === 4) {
                dayintext = 'Wednesday';
            } else if (day === 5) {
                dayintext = 'Thursday';
            } else if (day === 6) {
                dayintext = 'Friday';
            } else if (day == 7){
                day=0; dayintext='Saturday';
            }
            try{
                const response = await axios.post(`${BACKEND_URL}/api/admin/changeDay`, { day, dayintext });
                currentbidDay()
            }catch(error){
                console.error("Error setting day", error)
            }
        }
      };

    const changeStartTime = async(time)=>{
      const confirmed = window.confirm("Are you sure you want to change the starting time?");
      if (confirmed) {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/admin/changestarttime`, { time });
            currentbidDay()
        }catch(error){
            console.error("Error setting time", error)
        }
      }
    }

    const changeClosingTime = async(time)=>{
        const confirmed = window.confirm("Are you sure you want to change the closing time?");
      if (confirmed) {
            try{
                const response = await axios.post(`${BACKEND_URL}/api/admin/changeclosetime`, { time });
                currentbidDay()
            }catch(error){
                console.error("Error setting time", error)
            }
        }
      }
  

    

  return (
    <AdminBase>
        <div style={{ backgroundColor: 'rgb(12, 37, 51, 0.4)', width: '100%',  display: 'flex', justifyContent: 'flex-end',  }}>
            <button className='btn btn-outline-primary' style={{ border:'0px' ,  padding: '0',marginTop:'10px', marginRight:'20px' }} onClick={toggoleshowsettings}>
                <img src='../assets/images/settings.png' alt='Settings' style={{ width: '25px', marginRight: '6px', marginBottom: '6px' }} />
            </button>
        </div>
      
      <section style={{ backgroundColor: 'rgb(12, 37, 51, 0.4)', marginTop: '0px', height: showsettings ? '300px' : '0px', overflowY:'scroll' }} id='settings'>
        <div className='container admin-container text-ceter' >
            <h5 style={{ color: 'black' }}>{showsettings ? 'Settings' : ''}</h5>
            <div className='row mt-2' >
                <div className='col-2 p-2 settingsmenu' onClick={handleClearAll} style={{ backgroundColor: showclrall ? 'rgb(12, 37, 51, 0)' : '', borderTop: showclrall ? 'solid 1px' : '0px', borderLeft: showclrall ? 'solid 1px' : '0px',  }}>
                    <h6>Clear all</h6>
                </div>
                <div className='col-2 p-2 settingsmenu' onClick={handleChangeBidDay} style={{ backgroundColor: showdaychange ? 'rgb(12, 37, 51, 0)' : '', borderTop: showdaychange ? 'solid 1px' : '0px', borderRight: showdaychange ? 'solid 1px' : '0px',  }}>
                    <h6>Change bid Day</h6>
                </div>
                
                

            </div>
            <div className='mt-5' style={{ display: showclrall ? 'block' : 'none' }}>
                <p style={{color:'black', fontWeight:'bold' }}>Click to clear all the biddings, cart and chats</p>
                <button className='btn btn-danger btn-sm' onClick={clearAlldata}>Clear All</button>
            </div>
            <div className='mt-4 ' style={{ display: showdaychange ? 'block' : 'none' }}>
            <h5 style={{color:'black', fontWeight:'bold', marginBottom:'1em' }}>
                Current Bidding day an time: 
                {currentbDay} {currentbStartTime<12 ? <>{currentbStartTime}AM</> : <>{currentbStartTime-12}PM</>} to {currentbCloseTime<12 ? <>{currentbCloseTime}AM</> : <>{currentbCloseTime-12}PM</>}
            </h5>
                <p style={{color:'black', fontWeight:'bold' }}>Select the day you are going to set for accepting bidding</p>
               
                <div className='row mt-0'>
                    <div className='col-sm-12'>
                        {/* Day buttons */}
                        <div className="row">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                                <div key={day} >
                                    <button className='btn btn-primary btn-sm' onClick={() => changeDay(index + 1)}>{day}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className='mt-2' style={{color:'black', fontWeight:'bold' }}>Select the Bid starting time</p>
                <div className='row mt-0'>
                    <div className='col-sm-12 mt-0'>
                        {/* Time buttons */}
                        <div className="row">
                            {[...Array(24).keys()].map((time, index) => (
                                <div key={time} >
                                    <button disabled={index>=currentbCloseTime} className='btn btn-primary btn-sm' onClick={() => changeStartTime(index)}>{time}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className='mt-2' style={{color:'black', fontWeight:'bold' }}>Select the Bid closing time</p>
                <div className='row mt-0'>
                    <div className='col-sm-12 mt-0'>
                        {/* Time buttons */}
                        <div className="row">
                            {[...Array(24).keys()].map((time, index) => (
                                <div key={time} >
                                    <button disabled={index<=currentbStartTime} className='btn btn-secondary btn-sm' onClick={() => changeClosingTime(index)}>{time}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                

            </div>
        </div>
      </section>
      <section style={{ backgroundColor: 'rgb(138, 214, 212)', marginTop: '0px', Height:'50px' }} id='addproduct'>
        <div className='container admin-container text-ceter' >
        <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5 style={{ color: 'black' }}>Products</h5>
            {productlimit ? (
                <a  className='ml-auto mr-2' onClick={showProducts} style={{color:'blue', cursor:'pointer'}}>View all</a>
            ):(
                <a  className='ml-auto mr-2' onClick={hideProducts} style={{color:'blue', cursor:'pointer'}}>Hide</a>
            )}
            
        </div>
          <table className='table admin-table text-center' style={{width:'100%', borderCollapse: 'collapse'}}>
            <tr className='admin_listing'>
                <th>SiNo</th>
                <th>Name</th>
                <th>Added </th>
                <th>price</th>
                <th>Bids</th>
                <th>Description</th>
                <th>Created</th>
                {/* <th>Updated</th> */}
                <th></th>
                
            </tr>
            <tbody>
            {products.slice(0, productlimit ? 3 : products.length).map((product, index) => (
                    <tr className='admin_listing '>
                        <td>{index+1}</td>
                        <td>{product.name}</td>
                        <td>{product.seller.username}</td>
                        <td>{product.price}</td>
                        <td style={{fontSize:'18px', fontWeight:'bold'}}>{product.allow_bids ? '☑' : '☐' }</td>
                        <td style={{maxWidth:'15em'}}>{product.description && product.description.length > 32 ? product.description.substring(0, 32) + '...' : product.description}</td>
                        <td>{product.createdAt && new Date(product.createdAt).toLocaleDateString()}</td>
                        {/* <td>{product.createdAt && new Date(product.updatedAt).toLocaleDateString()}</td> */}
                        <td className='row' style={{width:'6em'}}>
                            {/* <a onClick={() => edit_product(product._id)} className='col-6 btn btn-outline-primary btn-sm' style={{border:'0'}}>✏️ </a> */}
                            <a onClick={() => delete_product(product._id)} className='col-12  btn btn-outline-danger btn-sm' style={{border:'0'}}>🗑️ </a>
                        </td>
                    </tr>
                ))}


            </tbody>
          </table>
        </div>
      </section>
      <section style={{ backgroundColor: 'rgb(238, 214, 214)', marginTop: '0px' }} id='addproduct'>
        <div className='container admin-container text-ceter'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5 style={{ color: 'black' }}>users</h5>
            {userlimit ? (
                <a  className='ml-auto mr-2' onClick={showUsers} style={{color:'blue', cursor:'pointer'}}>View all</a>
            ):(
                <a  className='ml-auto mr-2' onClick={hideUsers} style={{color:'blue', cursor:'pointer'}}>Hide</a>
            )}
            
        </div>
          <table className='table admin-table text-center' style={{width:'100%', borderCollapse: 'collapse'}}>
            <tr className='admin_listing'>
                <th>SiNo</th>
                <th>Username</th>
                <th>Email </th>
                <th>Fullname</th>
                <th>isAdmin</th>
                <th>isSeller</th>
                <th></th>
            </tr>
            <tbody>
                {users.slice(0, userlimit ? 3 : users.length).map((user, index) => (
                    <tr className='admin_listing '>
                        <td>{index+1}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.fullname}</td>
                        <td style={{fontSize:'18px', fontWeight:'bold'}}>{user.isAdmin ? '☑' : '☐' }</td>
                        <td style={{fontSize:'18px', fontWeight:'bold'}}>{user.isSeller ? '☑' : '☐' }</td>
                        <td className='row' style={{Width:'6em'}}>
                            {/* <a onClick={() => edit_user(user._id)} className='col-6 btn btn-outline-primary btn-sm' style={{border:'0'}}>✏️ </a> */}
                            <a onClick={() => delete_user(user._id)} className='col-6  btn btn-outline-danger btn-sm' style={{border:'0'}}>🗑️ </a>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      
    </AdminBase>
  );
};

export default AdminDashboard;
