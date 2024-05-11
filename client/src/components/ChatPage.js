import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../App';
import Consversation from './Conversation';

const userId = localStorage.getItem('user_id');

const ChatPage =() => {
    const chatContainerRef = useRef(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState('');
    const [receiver, setReceiver] = useState('');
    const [newChat, setnewChat] = useState(false);
    const [rec_available, setRec_available] = useState(true);
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('s_Id');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    localStorage.setItem('page_now', 'chat');

    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        if (sellerId) {
            setReceiverId(sellerId);
            fetchMessages(receiverId);
        }
      }, [receiverId]);

      useEffect(() => {
        if (receiverId) {
            fetchMessages(receiverId);
            fetchReciever(receiverId);
        }
      }, [receiverId]);
      const fetchMessages = async (receiverId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/chat`, {
                params: {
                    userId : userId,
                    receiverId: receiverId
                }
            });
            setMessages(response.data.messages);
            if (response.data.messages === 'no_chat') {
                setnewChat(true);
            }
        } catch (error) {
            console.error('Error fetching Messages:', error)
        }
      };

      const fetchReciever = async (receiverId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/user/${receiverId}`);
            console.log('Receiver username:', response.data.username)
            console.log('reciver details: ', response.data.deleted);
            setReceiver(response.data);

        } catch (error) {
            console.log('Error fetching user', error);
        }
      }
      
      const handleNewMessage = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BACKEND_URL}/api/chat`, {
                content: messageInput,
                userId: userId, 
                receiverId: receiverId
            });


            setMessageInput('');
            window.location.reload();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    
    
    return(
        <Consversation>
            
            <div className='chat_head row'>
                <div className='col-1'>
                    
                </div>
                <div className='col-8'>
                {receiverId === '' ? (
                    <div><h6></h6></div>
                ) : (
                    <h6>{receiver.username}</h6>)}
                </div>
            </div>
            <div ref={chatContainerRef}  className='container  chat_container'>
            {receiverId === '' ? (
                    <div className='text-center' style={{ backgroundColor: 'black', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <img src='../assets/images/chat.png' alt='Your Chats Image' style={{ width: '11em', marginLeft: 'auto', marginRight: 'auto' }} />
                        <p>Your Chats go here</p>
                    </div>

                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {newChat ? (
                        <div></div>
                    ) : (
                        
                        messages.map((message, index) => (
                            <div className={message.sender._id === userId ? 'sender_msg' : 'reciver_msg'} >
                                {/* <p key={index}>{message.createdAt}</p> */}
                                <p key={index}>{message.sender.username}</p>
                                <div className='msg_content'>
                                    <p key={index}>{message.content}</p>
                                </div>
                                
                            </div>
                        ))
                    )};
                </div>
                )}
                {receiver.deleted ? (
                    <div className='mx-auto mt-3' style={{ width: '100%', borderBottom: 'solid aqua 1px', borderRadius:'10px', textAlign:'center', backgroundColor:'black' }}>
                        <p style={{fontSize:'small'}}>This person is not availabe to chat </p>
                    </div>
                ) : ''}
                
            </div>
            <div className='container  chat_container_form'>
                <form onClick={handleNewMessage}>
                    <div className='chat_form row'>
                        <input
                            type='text'
                            placeholder='Type you message'
                            className='chat_input col-10'
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        {receiverId === '' || receiver.deleted  ? (
                            <div>
                                
                            </div>
                        ) : (
                        <button
                            type='submit'
                            className='chat_sub col-2 text-white'
                            
                        >Send
                        </button>
                        )}
                            
                            
                    </div>
                </form>
            </div>
            
        </Consversation>
    )
};

export default ChatPage;