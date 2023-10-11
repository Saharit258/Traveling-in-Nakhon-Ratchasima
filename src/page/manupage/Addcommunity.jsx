import React, { useState, useEffect} from 'react';
import Nav from '../../navigation/Nav';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import { firestore } from '../../database/firebase';
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from 'react-router-dom';

function Addcommunity() {
    const [communityphoto, setCommunityphoto] = useState("");
    const [communityvdo, setCommunityvdo] = useState("");
    const [communitysubject, setCommunitysubject] = useState("");
    const [communitytime, setCommunitytime] = useState("");
    const [communitymap, setCommunitymap] = useState("");
    const [userData, setUserData] = useState(null);
    const [userProfile, setUserProfile] = useState([]);
    const { user } = useUserAuth();
    const [todos, setTodos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!user) {
                setIsAuthenticated(false);
                navigate('/');
            } else {
                setIsAuthenticated(true);
                await fetchPost();
            }
        };
  
        checkAuthStatus();
    }, [user, navigate]);

    const fetchPost = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const profilesCollectionRef = collection(userDocRef, 'profiles');
        try {
            const querySnapshot = await getDocs(profilesCollectionRef);
            const userProfileData = [];

            querySnapshot.forEach((doc) => {
                userProfileData.push(doc.data());
            });
            setTodos(userProfileData);
        } catch (err) {
            console.error("Error", err);
        }
    }

    const communityPage = () => {
        navigate('/Community');
    };

    const addcommunity = async (e) => {
        e.preventDefault();
    
        if (!user) {
            alert("คุณยังไม่ได้ลงทะเบียน");
            navigate('/Login');
            return;
        }
    
        try {
            const docRef = await addDoc(collection(firestore, "communitys"), {
                email: user?.email,
                nameaddcom: todos[0]?.Name, // Assuming there is only one profile, change accordingly
                photo: communityphoto,
                vdo: communityvdo,
                subject: communitysubject,
                time: new Date().toLocaleString(),
                profileAddcom: todos[0]?.Profile, // Assuming there is only one profile, change accordingly
                mapaddcom: communitymap,
            });
    
            console.log("Document written with ID: ", docRef.id);
            alert("ดำเนินการเสร็จสิ้น");
            navigate('/Community');
        } catch(e) {
            console.error("Error", e);
        }
    }

    return (
        <>
            <Nav/>
            <div>
                <h1>Community-App</h1>
                <Form onSubmit={addcommunity}>
                    {/* Your form elements here */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="subject"
                            placeholder="subject"
                            onChange={(e) => setCommunitysubject(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="photo"
                            placeholder="photo"
                            onChange={(e) => setCommunityphoto(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Control
                            type="VDO"
                            placeholder="VDO"
                            onChange={(e) => setCommunityvdo(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Control
                            type="map"
                            placeholder="map"
                            onChange={(e) => setCommunitymap(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit">Add</Button>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default Addcommunity;
