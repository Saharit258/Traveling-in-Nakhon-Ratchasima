import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import { firestore, storage } from '../database/firebase';
import { useNavigate } from 'react-router-dom';
import Nav from './NavAdmin'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

function AddcarAdmin() {
    const [Timetablestart, setTimetablestart] = useState("");
    const [Timetableout, setTimetableout] = useState("");
    const [Time, setTime] = useState("");
    const [Price, setPrice] = useState("");
    const [cartype, setcartype] = useState("");
    const [Phonenumber, setPhonenumber] = useState("");
    const [note, setnote] = useState("");
    const [parkingspot, setparkingspot] = useState("");

    const navigate = useNavigate();

    const addFamous = async (e) => {
        e.preventDefault();
    
        try {
          const docRef = await addDoc(collection(firestore, "gps"), {
            Timetablestart: Timetablestart,
            Timetableout: Timetableout,
            Time: Time,
            Price: Price,
            cartype: cartype,
            Phonenumber: Phonenumber,
            note: note,
            parkingspot: parkingspot,
            latitude: "",
            longitude: "",
            timestamp: "",
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
      <h2>เพิ่มรถประจำทาง</h2>
      </div>
    <div className='addcera'>
        <Form onSubmit={addFamous}>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ต้นทาง</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setTimetablestart(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ปลายทาง</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setTimetableout(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>เวลา</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ราคา</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                <Form.Label>ประเภทรถ</Form.Label>
                <Form.Select onChange={(e) => setcartype(e.target.value)}>
                  <option value="">กรุณาเลือกอำเภอ</option>
                  <option value="รถตู้">รถตู้</option>
                  <option value="รถโดยสาร">รถโดยสาร</option>
                </Form.Select>
            </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>เบอร์ติดต่อ</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ตำแหน่งพักรถ</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setparkingspot(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>คำอธิบาย</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder=''
              onChange={(e) => setnote(e.target.value)}
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

export default AddcarAdmin