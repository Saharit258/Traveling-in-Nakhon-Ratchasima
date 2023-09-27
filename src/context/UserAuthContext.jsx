import React, { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import { auth } from '../database/firebase';

const userAuthContext = createContext();

export function UserAuthContextProvider( {children} ) {

    const [user, setuser] = useState({});

    function logIn(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signUp(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function logOut() {
        return signOut(auth);
    }

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth,  (currentuser) => {
            console.log("Auth", currentuser);
            setuser(currentuser);
        })

        return () => {
            unsubscribe();
        }

    }, [])



    return(
        <userAuthContext.Provider value={{ user, logIn, signUp, logOut }}>
            {children}
        </userAuthContext.Provider>
    )
}

export function useUserAuth(){
    return useContext(userAuthContext);
}