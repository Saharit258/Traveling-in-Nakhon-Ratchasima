import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, getDocs, query, collectionGroup, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../pagecss/Bookingroomcard.css'

function Bookingroomcard() {
    const uid = new URLSearchParams(useLocation().search).get('uid');
    const [dataFromFirestore, setDataFromFirestore] = useState([]);
    const [dataFromFirestores, setDataFromFirestores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUserAuth();
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            const arr = [];
            const querySnapshot = await getDocs(collectionGroup(firestore, 'rooms'));
            querySnapshot.forEach((doc) => {
                const profileData = doc.data();
                arr.push({ id: doc.id, ...profileData });
            });
            setDataFromFirestore(arr);
        } catch (error) {
            console.error('Error fetching rooms:', error.message);
        }
    };

    const fetchPost = async () => {
        try {
            const docRef = doc(firestore, 'hotels', dataFromFirestore[0]?.ruid, 'rooms', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setDataFromFirestores([fetchedData]);
            } else {
                console.log('Document not found.', uid);
                setDataFromFirestores([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    useEffect(() => {
        fetchRooms().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (dataFromFirestore.length > 0) {
            fetchPost().then(() => setLoading(false));
        }
    }, [dataFromFirestore]);

    return (
        <>
            <Nav />
            <div className='card-bookingroomcard'>
                <div className='brcard-leftside'>
                    <div className='hotel-box-rightside'>ข้อมูลโรงแรม</div>
                </div>
                <div className='brcard-rightside'></div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : dataFromFirestores.map((item) => (
                <div key={item.id}>
                    <h2>{item.roomno}</h2>
                    <h2>{item.type}</h2>
                </div>
            ))}
            {dataFromFirestores.length === 0 && !loading && <p>Loading...</p>}
        </>
    );
}

export default Bookingroomcard;

/*เก็บ 2 id (uui กับ huid) */