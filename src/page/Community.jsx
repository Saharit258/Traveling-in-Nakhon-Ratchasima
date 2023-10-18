import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, collectionGroup, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav';
import { Form, Alert, Button } from 'react-bootstrap';
import '../pagecss/Community.css';
import Swal from 'sweetalert2'

function Community() {
    const navigate = useNavigate();
    const { user } = useUserAuth();
    const [community, setCommunity] = useState([]);
    const [profiles, setProfiles] = useState([]);

    const AddcommunityPage = () => {
        if (!user) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'คุณยังไม่ได้ลงทะเบียน',
              })
            navigate('/Login');
        } else {
            navigate('/Addcommunity');
        }
    };

    const fetchPost = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'communitys'));
            const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            // Sort by time
            const sortedData = newData.sort((a, b) => new Date(b.time) - new Date(a.time));

            console.log("Data: ", sortedData);
            setCommunity(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchPPost = async () => {
        const profilePromises = community.map(async (todo) => {
            const userProfilesQuery = query(collection(firestore, "users", todo.uid, "profiles"));
            const querySnapshot = await getDocs(userProfilesQuery);
            const userProfiles = [];

            querySnapshot.forEach((doc) => {
                userProfiles.push(doc.data());
            });

            return userProfiles;
        });

        const profilesForAllPosts = await Promise.all(profilePromises);
        setProfiles(profilesForAllPosts);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
        fetchPPost();
    }, [community]);

    return (
        <>
            <Nav />
            <div className='community-rox'>
                <Button className='community-button-add' onClick={AddcommunityPage}>เพิ่มเรื่องราว +</Button>
                <div className='box-community'>
                    <div>
                        {community?.map((todo, i) => (
                            <div key={i} className='community-card'>
                                {profiles[i]?.map((profile, j) => (
                                    <img key={j} src={profile.profile} className='profile-imgg' />
                                ))}
                                {profiles[i]?.map((profile, j) => (
                                    <h3 key={j} className='community-email'>{profile.name}</h3>
                                ))}
                                <p className='community-time'>{todo?.time}</p>
                                <hr></hr>
                                <p className='community-subject'>{todo.subject}</p>
                                {todo.mapaddcom && (
                                    <a className='community-subject' href={todo.mapaddcom}>{todo.mapaddcom}</a>
                                )}
                                <img className='community-photo' src={todo.photo} />
                                {todo.vdo && (
                                    <iframe className='community-vdo' src={todo.vdo} title="Community Video"></iframe>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Community;
