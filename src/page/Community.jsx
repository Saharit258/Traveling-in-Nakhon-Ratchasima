import React, { useState, useEffect } from 'react'
import Nav from '../navigation/Nav';
import { Form, Alert, Button } from 'react-bootstrap'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Community.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuth } from "../context/UserAuthContext";

function Community() {

    const navigate = useNavigate();
    const { user } = useUserAuth();
    const [community, setCommunity] = useState([]);

    const AddcommunityPage = () => {
        if (!user) {
            alert("คุณยังไม่ได้ลงทะเบียน");
            navigate('/Login');
        } else {
            navigate('/Addcommunity');
        }
    };

    const fetchPost = async () => {
        try {
          const querySnapshot = await getDocs(collection(firestore, 'communitys'));
          const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      
          // เรียงลำดับตาม time
          const sortedData = newData.sort((a, b) => new Date(b.time) - new Date(a.time));
      
          setCommunity(sortedData);
          console.log('Data', community, sortedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      useEffect(() => {
        fetchPost();
      }, []);
      

    return (
        <>
            <Nav />
            <div className='community-rox'>
                <Button className='community-button-add' onClick={AddcommunityPage}>Community +</Button>
                <div className='box-community'>
                <div>
                <div className='box-community-rox'>
                    {community?.map((todo, i) => (
                        <div key={i} className='community-card'>
                            <img src={todo.profileAddcom} className='profile-imgg' />
                            <h3 className='community-email'>{todo.nameaddcom}</h3>
                            <p className='community-time'>{todo?.time}</p>
                            <hr></hr>
                            <p className='community-subject'>{todo.subject}</p>
                            {todo.mapaddcom && (
                            <a className='community-subject' href={todo.mapaddcom} >{todo.mapaddcom}</a>
                            )}
                            <img className='community-photo' src={todo.photo}/>
                            {todo.vdo && (
                            <iframe className='community-vdo' src={todo.vdo} title="Community Video"></iframe>
                            )}
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default Community;
