import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import { firestore, storage } from '../database/firebase';
import { useNavigate } from 'react-router-dom';
import Nav from './NavAdmin'
import Swal from 'sweetalert2'
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function AddpromptionAdmin() {
    const [communityphoto, setCommunityphoto] = useState("");
    const [about, setabout] = useState("");
    const [promotionname, setpromotionname] = useState("");
    const [starttime, setstarttime] = useState("");
    const [endtime, setendtime] = useState("");
    const [discount, setdiscount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleUplosd = (e) => {
        setIsLoading(true);
    
        const imgs = ref(storage, `Imgs/${v4()}`);
        uploadBytes(imgs, e.target.files[0]).then((data) => {
          getDownloadURL(data.ref).then((val) => {
            setCommunityphoto(val);
            setIsLoading(false);
          });
        });
      };

    const addFamous = async (e) => {
        e.preventDefault();
    
        try {
          const docRef = await addDoc(collection(firestore, "promotions"), {
            image: communityphoto,
            promotionname: promotionname,
            starttime: starttime,
            endtime: endtime,
            about: about,
            discount: discount,
          });
          console.log("Document written with ID: ", docRef.id);
          alert("ลงทะเบียนเสร็จสิ้น");
          navigate("/SightseeingAdmin");
        } catch (e) {
          console.error("Error", e);
        }
      };

  return (
    <>
    <Nav/>
    <div className="card-Famous-adminoo">
      <h2>เพิ่มโปรโมชั่นต่างๆ</h2>
      </div>
    <div className='addcera'>
        <Form onSubmit={addFamous}>

        <Form.Group className="mb-3" controlId="formBasicName">
           <Form.Label>รูป</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder="รูป"
                      onChange={handleUplosd} 
                    />
                  </Form.Group>

                  {isLoading && <p>กำลังโหลดข้อมูล...</p>}

                  {communityphoto && (
                    <img src={communityphoto} alt="Community Photo" className="community-photo-add" />
                  )}


          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ชื่อ</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setpromotionname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>วันเริ่ม</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setstarttime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>วันหมด</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setendtime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ลดราคา</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setdiscount(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>คำอธิบาย</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder=''
              onChange={(e) => setabout(e.target.value)}
            />
          </Form.Group>


          <div className="d-grid gap-2">
            <button className="d-grid-gap-2-1" variant="primary" type="submit">เพิ่ม</button>
          </div>
        </Form>
    </div>
    </>
  )
}

export default AddpromptionAdmin