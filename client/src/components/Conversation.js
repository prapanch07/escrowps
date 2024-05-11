import React, { useEffect, useState } from 'react';
import BaseLayout from './BaseLayout';
import axios from 'axios';
import { BACKEND_URL } from '../App';

const userId = localStorage.getItem('user_id');

const Consversation = ({ children }) => {
    const [speakers, setSpeakers] = useState([]);
    localStorage.setItem('page_now', 'chat');

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                console.log('Conversation userId',userId)
                const response = await axios.get(`${BACKEND_URL}/api/chat/conversation`, {
                    params: {
                        userId: userId
                    }
                });
                console.log('response :',response.data)
                setSpeakers(response.data)
                console.log(speakers);
            } catch (error) {
                console.error('Error fetching conversations :', error);
            }
        };

        fetchSpeakers();
    }, [userId]);

    
    return(
        <div style={{height:"100vh", overflow:'hidden'}}>
            <BaseLayout>
            
            <div className='container-fluid conver_background'>
                <div className='row'>
                    <div className='col-3 chat_list'>
                        <h5 className='mt-3'>Recent chats</h5>
                        <div className='p-2 pt-4'>

                            {speakers.map(speaker => (
                                <a href={`/chat?s_Id=${speaker._id}`}>
                                    <div className='con_list' key={speaker._id}>
                                        <p>{speaker.username}</p> 
                                    </div>
                                </a>
                            ))}
                            
                            
                            
                        </div>
                        {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                        </p> */}
                    </div>
                    <div className='col-9'>
                        <main>
                            {children}
                        </main>
                    </div>
                
                </div>
                
            </div>
            
            </BaseLayout>
        </div>
    )
};

export default Consversation;