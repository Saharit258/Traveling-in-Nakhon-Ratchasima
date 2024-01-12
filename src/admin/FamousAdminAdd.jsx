import React, { useState } from 'react'
import Nav from './NavAdmin'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import { firestore, storage } from '../database/firebase'
import { v4 } from "uuid"; 
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import './admincss/FamousAdminAdd.css'

function FamousAdminAdd() {

  const [famousname, setFamousname] = useState("");
  const [famousmap, setFamousmap] = useState("");
  const [famousadd, setFamousadd] = useState("");
  const [famousdistrict, setFamousdistrict] = useState("");
  const [famousdistricts, setFamousdistricts] = useState("");
  const [famouscodezo, setFamouscodezo] = useState("");
  const [foodstyle, setFoodstyle] = useState("");
  const [famoutime, setFamoustime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [price, setPrice] = useState("");
  const [imgs, setImgs] = useState([]);
  const [type, setType] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [ad, setad] = useState("");

  const navigate = useNavigate();

  const handleUpload = async (files) => {
    const imgArray = [];
    for (const file of files) {
      const imgRef = ref(storage, `Imgs/${v4()}`);
      await uploadBytes(imgRef, file)
        .then(data => getDownloadURL(data.ref))
        .then(url => imgArray.push(url));
    }
    console.log("img", imgArray);
    alert("ลงรูปแล้ว");
    setImgs(imgArray);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  const addFamous = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(firestore, "famouss"), {
        imgUrls: [...imgs],
        name: famousname,
        map: famousmap,
        add: famousadd,
        district: famousdistrict,
        districts: famousdistricts,
        codezo: famouscodezo,
        style: foodstyle,
        time: famoutime,
        closingTime: closingTime,
        price: price,
        lat: lat,
        lon: lon,
        type: type,
        ad: ad,
      });
      console.log("Document written with ID: ", docRef.id);
      alert("ลงทะเบียนเสร็จสิ้น");
      navigate("/Famous");
    } catch (e) {
      console.error("Error", e);
    }
  };

  return (
    <>
      <Nav />
      <div className='box-todo-famous'>
        <h1>Famous-App</h1>

        <div>
          <input type="file" multiple onChange={(e) => handleFileChange(e)} /><br />
        </div>

        <Form onSubmit={addFamous}>
          <Form.Group className="mb-3" controlId='formBasicName'>
            <Form.Label>ชื่อ</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setFamousname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicPassword'>
            <Form.Label>แผนที่</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setFamousmap(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
            <Form.Label>ที่อยู่</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setFamousadd(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
            <Form.Label>ตำบล</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setFamousdistrict(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                <Form.Label>อำเภอ</Form.Label>
                <Form.Select onChange={(e) => setFamousdistricts(e.target.value)}>
                  <option value="">กรุณาเลือกอำเภอ</option>
                  <option value="เมืองนครราชสีมา">เมืองนครราชสีมา</option>
                  <option value="พิมาย">พิมาย</option>
                  <option value="ขามทะเลสอ">ขามทะเลสอ</option>
                  <option value="โนนไทย">โนนไทย</option>
                  <option value="โชคชัย">โชคชัย</option>
                  <option value="เฉลิมพระเกียรติ">เฉลิมพระเกียรติ</option>
                  <option value="โนนแดง">โนนแดง</option>
                  <option value="ปักธงชัย">ปักธงชัย</option>
                  <option value="สูงเนิน">สูงเนิน</option>
                  <option value="โนนสูง">โนนสูง</option>
                  <option value="จักราช">จักราช</option>
                  <option value="สีคิ้ว">สีคิ้ว</option>
                  <option value="ขามสะแกแสง">ขามสะแกแสง</option>
                  <option value="พระทองคำ">พระทองคำ</option>
                  <option value="หนองบุญมาก">หนองบุญมาก</option>
                  <option value="ครบุรี">ครบุรี</option>
                  <option value="ห้วยแถลง">ห้วยแถลง</option>
                  <option value="วังน้ำเขียว">วังน้ำเขียว</option>
                  <option value="คง">คง</option>
                  <option value="ด่านขุนทด">ด่านขุนทด</option>
                  <option value="ปากช่อง">ปากช่อง</option>
                  <option value="บ้านเหลื่อม">บ้านเหลื่อม</option>
                  <option value="เสิงสาง">เสิงสาง</option>
                  <option value="เทพารักษ์">เทพารักษ์</option>
                  <option value="ประทาย">ประทาย</option>
                  <option value="ชุมพวง">ชุมพวง</option>
                  <option value="บัวใหญ่">บัวใหญ่</option>
                  <option value="เมืองยาง">เมืองยาง</option>
                  <option value="บัวใหญ่">บัวใหญ่</option>
                  <option value="แก้งสนามนาง">แก้งสนามนาง</option>
                  <option value="บัวลาย">บัวลาย</option>
                  <option value="สีดา">สีดา</option>
                  <option value="ลำทะเมนชัย">ลำทะเมนชัย</option>
                </Form.Select>
            </Form.Group>


          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
            <Form.Label>รหัสไปรษณีย์</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setFamouscodezo(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
            <Form.Label>รูปแบบอาหาร</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setFoodstyle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
            <Form.Label>เวลาเปิด</Form.Label>
            <Form.Control
              type='time'
              placeholder='เวลาเปิด'
              onChange={(e) => setFamoustime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
            <Form.Label>เวลาปิด</Form.Label>
            <Form.Control
              type='time'
              placeholder='เวลาปิด'
              onChange={(e) => setClosingTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
           <Form.Label>ราคา</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
           <Form.Label>lat</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setLat(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
           <Form.Label>lon</Form.Label>
            <Form.Control
              type='text'
              placeholder=''
              onChange={(e) => setLon(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
           <Form.Label>คำอธิบาย</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder=''
              onChange={(e) => setad(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="register-name" controlId='formBasicName'>
            <Form.Check
              type="radio"
              label="ร้านอาหาร"
              name="sex"
              value="ร้านอาหาร"
              id="maleRadio"
              onChange={(e) => setType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="สถานที่เที่ยว"
              name="sex"
              value="สถานที่เที่ยว"
              id="femaleRadio"
              onChange={(e) => setType(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">เพิ่ม</Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default FamousAdminAdd;
