import React, { useState } from 'react';
import Nav from '../navigation/NavPartner';
import { useUserAuth } from "../context/UserAuthContext";
import { Form, Button } from 'react-bootstrap';
import { collection, addDoc, doc, setDoc, getDocs, query, where, FieldValue, updateDoc } from 'firebase/firestore'; // ไปเพิ่ม setDoc นะ
import { firestore, storage } from '../database/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from "uuid";
import { Link, useNavigate } from 'react-router-dom';
import './pagecss/addroom.css';

function AddRoom() {
    const { user } = useUserAuth();
    const navigate = useNavigate();

    const [roomno, setNo] = useState();
    const [type, setType] = useState();
    const [bed, setBed] = useState();
    const [bednum, setBednum] = useState();
    const [people, setPeople] = useState();
    const [price, setPrice] = useState();
    const [imgs, setImgs] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);


    const handleUpload = async (files) => {
        const imgArray = [];
        for (const file of files) {
            const imgRef = ref(storage, `Imgs/${v4()}`);
            await uploadBytes(imgRef, file)
                .then(data => getDownloadURL(data.ref))
                .then(url => imgArray.push(url));
        }
        setImgs(imgArray);
        console.log("img", imgs)
        alert("Images saved successfully!");
    };


    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleUpload(files);
        }
    };

    const handleCheckbox = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        // Check if the checkbox is checked or unchecked and update the selected facilities array accordingly
        if (isChecked) {
            // Add the value to the array if checked
            setSelectedFacilities((prevSelectedFacilities) => [...prevSelectedFacilities, value,]);
        } else {
            // Remove the value from the array if unchecked
            setSelectedFacilities((prevSelectedFacilities) =>
                prevSelectedFacilities.filter((facility) => facility !== value)
            );
        }
    };

    const addroom = async (e) => {
        e.preventDefault();
    
        const docRef = await addDoc(collection(firestore, 'hotels', user.uid, 'rooms'), {
            imgUrls: [...imgs],
            roomfacility: selectedFacilities,
            roomno: roomno,
            type: type,
            bed: bed,
            bednum: bednum,
            people: people,
            price: price,
            roomstatus: "ว่าง",
            booktime: "",
            ruid: user.uid,
            uid: ""
        });
    
        await updateDoc(docRef, {
            uid: docRef.id
        });
    
        console.log('Document written', docRef.id);
        alert("เพิ่มห้องพักเรียบร้อย");
        navigate('/Roomadd');
    }

    return (
        <>
            <Nav />
            <h3 className='center'>เพิ่มรายละเอียดห้องพัก</h3>
            <div className='box-addroom'>
                <Form onSubmit={addroom}>
                    <div className='addroom-card'>
                        <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                            <Form.Label>เลขห้อง</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="เลขห้อง"
                                onChange={(e) => setNo(e.target.value)}
                            />
                        </Form.Group>
                        <h6 className='addroom-left'>ประเภทห้อง</h6>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">เลือก</label>
                            </div>
                            <select
                                className="custom-select"
                                id="inputGroupSelect01"
                                onChange={(e) => setType(e.target.value)} // เมื่อมีการเลือกเปลี่ยนค่าจะเก็บลง state
                                value={type} // ให้ค่าที่เลือกเป็นค่าปัจจุบันของ state
                            >

                                <option value="">เลือกประเภทห้อง</option>
                                <option value="พรีเมียม">ห้องสแตนดาร์ด (Standard room)</option>
                                <option value="ซูพีเรีย">ห้องซูพีเรีย (Superior room)</option>
                                <option value="ดีลักซ์">ห้องดีลักซ์ (Deluxe room)</option>
                                <option value="สวีท">ห้องสวีท (Suite room)</option>
                                <option value="ครอบครัว">ห้องสำหรับครอบครัว(Family Room)</option>
                                <option value="ห้องเชื่อม">ห้องเชื่อม (Connecting Room)</option>
                                <option value="สตูดิโอ">ห้องสตูดิโอ (Studio)</option>
                            </select>
                        </div>

                        <div className='addroom-flexbox'>
                            <h6 className='addroom-left'>ประเภทเตียง</h6>
                            <h6 className='addroom-center'>จำนวนเตียง</h6>
                            <h6 className='addroom-right'>จำนวนคน</h6>
                        </div>
                        <div className='addroom-flexbox'>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <label className="input-group-text" htmlFor="inputGroupSelect01">เลือก</label>
                                </div>
                                <select
                                    className="custom-select"
                                    id="inputGroupSelect01"
                                    onChange={(e) => setBed(e.target.value)} // เมื่อมีการเลือกเปลี่ยนค่าจะเก็บลง state
                                    value={bed} // ให้ค่าที่เลือกเป็นค่าปัจจุบันของ state
                                >
                                    <option value="">เลือกประเภทเตียง</option>
                                    <option value="เตียงขนาดเล็ก">เตียงขนาดเล็ก (Single size bed)</option>
                                    <option value="เตียงควีน">เตียงควีน (Queen size bed)</option>
                                    <option value="เตียงคิง">เตียงคิง (King size bed)</option>
                                    <option value="เตียงดับเบิล">เตียงดับเบิล (Double size bed)</option>
                                    <option value="เตียงสองชั้น">เตียงสองชั้น (Bunk Bed)</option>
                                </select>
                            </div>


                            <div className='addroom-bednum'>
                                <input placeholder='ใส่จำนวนเตียง' type='number' onChange={(e) => setBednum(e.target.value)}></input>
                            </div>


                            <div>
                                <input type='number' onChange={(e) => setPeople(e.target.value)} placeholder='ใส่จำนวนคนพัก'></input>
                            </div>

                        </div>

                        <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                            <Form.Label>สิ่งอำนวยความสะดวก</Form.Label>
                            <div >
                                <input type="checkbox" className='checkbox' value="เครื่องปรับอากาศ" onChange={handleCheckbox} /> เครื่องปรับอากาศ
                                <input type="checkbox" className='checkbox' value="พัดลม" onChange={handleCheckbox} /> พัดลม
                                <input type="checkbox" className='checkbox' value="โทรทัศน์" onChange={handleCheckbox} /> โทรทัศน์
                                <input type="checkbox" className='checkbox' value="ตู้เย็น" onChange={handleCheckbox} /> ตู้เย็น
                                <input type="checkbox" className='checkbox' value="เครื่องชงชา/กาแฟ" onChange={handleCheckbox} /> เครื่องชงชา/กาแฟ
                                <input type="checkbox" className='checkbox' value="ตู้เสื้อผ้า" onChange={handleCheckbox} /> ตู้เสื้อผ้า
                                <input type="checkbox" className='checkbox' value="ที่เป่าผม" onChange={handleCheckbox} /> ที่เป่าผม
                                <input type="checkbox" className='checkbox' value="ผ้าเช็ดตัว" onChange={handleCheckbox} /> ผ้าเช็ดตัว
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                            <Form.Label>ราคา(บาท)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="ราคาต่อคืน"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                            <Form.Label>เพิ่มรูปห้องพัก</Form.Label>
                            <Form.Control
                                type="file" multiple onChange={(e) => handleFileChange(e)}
                            />
                        </Form.Group>
                        <button className="con-addroom-btn" variant='primary' type="submit">ลงทะเบียนห้องพัก</button>
                    </div>
                </Form>
            </div>

        </>
    )
}

export default AddRoom