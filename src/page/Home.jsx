import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'

import { collection, addDoc, getDocs, QuerySnapshot } from 'firebase/firestore';
import { firestore } from '../database/firebase'


function Home() {

    const { logOut, user } = useUserAuth();
    const [todos, setTodos] = useState([]);

    console.log(user);

    const navigate = useNavigate();

    const handleLogout = async () => { 
        try{
            await logOut();
            navigate('/');
        } catch (err) {
            console.log(err.message);
        }
    }

    const fetchPost = async () => {
        await getDocs(collection(firestore, "todos"))
                    .then((querySnapshot) => {
                        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
                        setTodos(newData);
                        console.log(todos, newData);
                    })
    }

    useEffect(() => {
        fetchPost();
    }, []);


    return (
        <div>
            <Nav />
            <h2>Welcome to home page</h2>
            <p>Hi, {user?.email}</p>
  
            <div>
            {todos?.map((todo, i) =>(
                    <p key={i}>{todo.todo}</p>
                ))}
            </div>

        </div>
    )
}

export default Home