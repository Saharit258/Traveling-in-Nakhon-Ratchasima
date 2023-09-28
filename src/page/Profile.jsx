import React, { useState, useEffect} from 'react'
import Nav from '../navigation/Nav'
import { collection, addDoc, getDocs, QuerySnapshot, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Profile() {

  const [todos, setTodos] = useState([]);

  const fetchPost = async () => {
      try{
        await getDocs(collection(firestore, "todos"))
                    .then((querySnapshot) => {
                        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id: doc.id}));
                        setTodos(newData);
                        console.log("Data",todos, newData);
                    })
      }catch (err) {
        setError(err.message);
        console.error("Error", err);
    }
  }

    useEffect(() => {
        fetchPost();
    }, []);

  return (
    <>
    <Nav/>
    <div>Profile
    <div>
        {todos?.map((todo, i) =>(
                <p key={i}>{todo.todo}</p>
            ))}
        </div>
    </div>
    </>
  )
}

export default Profile