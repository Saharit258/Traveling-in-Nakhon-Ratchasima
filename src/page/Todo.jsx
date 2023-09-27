import React, { useState, useEffect} from 'react'
import Nav from '../navigation/Nav'
import { collection, addDoc, getDocs, QuerySnapshot } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Todo() {

    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);

    const addTodo = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(firestore, "todos"),{
                todo: todo
            })
            console.log("Document written with ID: ", docRef.id);
        } catch(e){
            console.error("Error", e);
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
    <>
    <Nav/>
    <div>
        <h1>Todo-App</h1>
        <div>
            <input 
                type="text" 
                placeholder='What do you have to do today' 
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type='submit' onClick={addTodo}>Submit</button>
        </div>

        <div>
        {todos?.map((todo, i) =>(
                <p key={i}>{todo.todo}</p>
            ))}
        </div>
        
    </div>
    </>
  )
}

export default Todo