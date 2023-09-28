const { auth, firestore } = require('../database/firebase');
const {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut: firebaseSignOut
} = require("firebase/auth");
const { collection, doc, setDoc } = require('firebase/firestore');

class Authentication {
    constructor() {
        // initialize
        this.storageKey = 'users';
    }

    // Encode data from Base64
    encodeData(data) {
        const jsonData = JSON.stringify(data);
        return btoa(jsonData);
    }

    // Decode data from Base64
    decodeData(encodedData) {
        const jsonData = atob(encodedData);
        return JSON.parse(jsonData);
    }

    getAuthStatus() {
        const encodedData = localStorage.getItem(this.storageKey);
        if (encodedData) {
            const decodedData = this.decodeData(encodedData);
            if (decodedData && decodedData.user) {
                return decodedData.user; // return user data with decoded data
            }
        }
        return null; // if not found user
    }

    
}

module.exports = Authentication;
