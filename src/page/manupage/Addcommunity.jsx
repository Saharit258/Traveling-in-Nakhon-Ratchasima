import React, { useState, useEffect} from 'react';
import Nav from '../../navigation/Nav';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import { firestore } from '../../database/firebase';
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from 'react-router-dom';
import '../../pagecss/Addcommunity.css'
import Swal from 'sweetalert2'

function Addcommunity() {
    const [communityphoto, setCommunityphoto] = useState("");
    const [communityvdo, setCommunityvdo] = useState("");
    const [communitysubject, setCommunitysubject] = useState("");
    const [communitytime, setCommunitytime] = useState("");
    const [communitymap, setCommunitymap] = useState("");
    const [userData, setUserData] = useState(null);
    const [userProfile, setUserProfile] = useState([]);
    const [uidProfile, setUidProfile] = useState([]);
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
                nameaddcom: todos[0]?.name, // Assuming there is only one profile, change accordingly
                photo: communityphoto,
                vdo: communityvdo,
                subject: communitysubject,
                time: new Date().toLocaleString(),
                profileAddcom: todos[0]?.profile, // Assuming there is only one profile, change accordingly
                mapaddcom: communitymap,
                uid: user?.uid,
            });
    
            console.log("Document written with ID: ", docRef.id);
            let timerInterval
            Swal.fire({
              title: 'กำลังทำการบันทึกข้อมูล',
              html: 'I will close in <b></b> milliseconds.',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                  b.textContent = Swal.getTimerLeft()
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
              }
            })
            navigate('/Community');
        } catch(e) {
            console.error("Error", e);
        }
    }

    return (
        <>
            <Nav/>
            <div>
                <div className="box">
                <h1>สร้างโพสต์</h1>
                <Form onSubmit={addcommunity}>
                    {/* Your form elements here */}
                    <Form.Group className="addcom-subject" controlId="formBasicEmail">
                        <Form.Control
                            type="subject"
                            placeholder="เรื่อง"
                            onChange={(e) => setCommunitysubject(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="addcom-photo" controlId="formBasicPassword">
                        <Form.Control
                            type="photo"
                            placeholder="รูป"
                            onChange={(e) => setCommunityphoto(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="addcom-VDO" controlId="formBasicConfirmPassword">
                        <Form.Control
                            type="VDO"
                            placeholder="วีดีโอ"
                            onChange={(e) => setCommunityvdo(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="addcom-map" controlId="formBasicConfirmPassword">
                        <Form.Control
                            type="map"
                            placeholder="แผนที่"
                            onChange={(e) => setCommunitymap(e.target.value)}
                        />
                    </Form.Group>

                    <div className="addcom-button">
                        <Button variant="primary" type="submit">โพสต์</Button>
                    </div>
                </Form>
                </div>
            </div>
        </>
    )
}

export default Addcommunity;
