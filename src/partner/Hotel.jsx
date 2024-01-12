import React, { useState, useEffect } from 'react';
import Nav from '../navigation/NavPartner';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import './pagecss/Hotel.css';
import Swal from 'sweetalert2';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../database/firebase';

function Hotel() {
  const { logOut, user } = useUserAuth();
  const [hotel, setDataFromFirestore] = useState([]);
  const [editid, setEditId] = useState(null);
  const [form, setForm] = useState({
    facility: [], // Change facility to an array for checkboxes
    imgUrls: [], // Use an array for imgUrls
  });
  const [img, setImg] = useState('');
  let timerInterval;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: checked
          ? [...prevForm[name], value]
          : prevForm[name].filter((item) => item !== value),
      }));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({});
  };

  const handleSaveHotel = async () => {
    const userDocRef = doc(firestore, 'hotels', user.uid);
    try {
      await updateDoc(userDocRef, form);
      setEditId(null);
      Swal.fire({
        title: 'กำลังทำการบันทึกข้อมูล',
        html: 'I will close in <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
      });
      fetchDataFromFirestore();
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleImageUpload = async (file) => {
    const imgs = ref(storage, `Imgs/${v4()}`);
    try {
      const data = await uploadBytes(imgs, file);
      const imgUrl = await getDownloadURL(data.ref);
      setImg(imgUrl);
      setForm({
        ...form,
        imgUrls: [...(form.imgUrls || []), imgUrl],
      });
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleUpload = (e) => {
    const files = e.target.files;
    for (const file of files) {
      if (file) {
        handleImageUpload(file);
      }
    }
  };

  const fetchDataFromFirestore = async () => {
    try {
      const docRef = doc(firestore, 'hotels', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = { id: docSnap.id, ...docSnap.data() };
        setDataFromFirestore([fetchedData]);
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const renderFormField = (fieldName, label) => {
    return editid === user.uid ? (
      <input
        className='editroom-card'
        onChange={(e) => handleChange(e)}
        type="text"
        name={fieldName}
        value={form[fieldName] ?? hotel[0]?.[fieldName]}
        placeholder={label}
      />
    ) : (
      hotel[0]?.[fieldName]
    );
  };

  return (
    <>
      <Nav />
      {hotel.map((item, i) => (
        <div key={i}>
          <div className='card-bookingcard'>

            <div className="bookingcard-sidebar">
              <h4>รูปภาพที่พักของคุณ</h4>
              <div className="image-container-hotel">
                {(editid === user.uid ? form.imgUrls : item.imgUrls) &&
                  (editid === user.uid ? form.imgUrls : item.imgUrls).length > 0 && (
                    (editid === user.uid ? form.imgUrls : item.imgUrls).map((url, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={url}
                        className="item-image-hotel"
                        onClick={(e) => handleChange(e)}
                      />
                    ))
                )}
              </div>
              {editid === user.uid && (
                <>
                  <p>เพิ่มรูปภาพที่พัก: {editid === user.uid && (
                    <>
                      {(form.imgUrls || []).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="item-image-hotel"
                          onClick={(e) => handleChange(e)}
                        />
                      ))}
                      <input
                        type="file"
                        className="card-profile-img-input"
                        multiple
                        onChange={(e) => handleUpload(e)}
                      />
                    </>
                  )}</p>
                </>
              )}
            </div>

            <div className='bookingcard-product'>
              <h4>รายละเอียดที่พักของคุณ</h4>
              <div><b>ชื่อที่พัก</b> : {renderFormField('name', 'ชื่อที่พัก')}</div>
              <div><b>ประเภทที่พัก</b> : {renderFormField('type', 'ประเภทที่พัก')}</div>
              <div><b>ที่อยู่</b> : {renderFormField('address', 'บ้านเลขที่ หมู่ ถนน')}</div>
              <div><b>ตำบล</b> : {renderFormField('tambol', 'ตำบล')}</div>
              <div><b>อำเภอ</b> : {renderFormField('amper', 'อำเภอ')}</div>
              <div><b>รหัสไปรษณีย์</b> : {renderFormField('zipcode', 'รหัสไปรษณีย์')}</div>
              <div><b>รายละเอียดที่พัก</b> :<br /> {renderFormField('detail', 'รายละเอียดที่พักของท่าน')}</div>
              <div>
                <b>สิ่งอำนวยความสะดวก</b> :<br />
                {editid === user.uid ? (
                  <>
                    {["ขี่ม้า", "สปา", "อาหารเช้า"].map((option, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          id={`facility_${index}`}
                          name="facility"
                          value={option}
                          checked={form.facility.includes(option)}
                          onChange={(e) => handleChange(e)}
                        />
                        <label htmlFor={`facility_${index}`}>{option}</label>
                      </div>
                    ))}
                  </>
                ) : (
                  <ul>
                    {item.facility && item.facility.length > 0 && (
                      item.facility.map((facility, index) => (
                        <li key={index}>{facility}</li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {editid === user.uid ? (
        <>
          <button className="save-hotel-btn" onClick={() => handleSaveHotel(user.uid)}>ตกลง</button>
          <button className="end-hotel-btn" onClick={() => handleCancel(user.uid)}>ยกเลิก</button>
        </>
      ) : (
        <button className="edit-hotel-btn" onClick={() => setEditId(user.uid)}>แก้ไข</button>
      )}
    </>
  );
}

export default Hotel;
