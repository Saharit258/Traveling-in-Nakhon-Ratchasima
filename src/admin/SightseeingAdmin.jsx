import React, { useState, useEffect } from 'react';
import Nav from './NavAdmin';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { useNavigate } from 'react-router-dom';

function Sightseeing() {
  const [famous, setFamous] = useState([]);
  const [selectedCartypes, setSelectedCartypes] = useState([]);
  const navigate = useNavigate();

  const handleConfirmhotellog = (id) => {
    navigate(`/Gpscar?uid=${id}`);
  };

  const handleCheckboxChange = (cartype) => {
    const updatedSelectedCartypes = selectedCartypes.includes(cartype)
      ? selectedCartypes.filter((type) => type !== cartype)
      : [...selectedCartypes, cartype];

    setSelectedCartypes(updatedSelectedCartypes);
  };

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'gps'));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredData =
        selectedCartypes.length === 0
          ? fetchedData
          : fetchedData.filter((post) =>
              selectedCartypes.includes(post.cartype)
            );

      setFamous(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [selectedCartypes]);

  return (
    <>
      <Nav />
      <div>
        <div className="card-promotion-a">
          <h2>รถประจำทาง</h2>
        </div>

        <div className="box-container-promotion">
          <div className="promotion-sidebar">
            <h2>โปรโมชั่นต่างๆ</h2>

            <div>
              <label>
                <input
                  type="checkbox"
                  value="รถตู้"
                  onChange={() => handleCheckboxChange('รถตู้')}
                />
                รถตู้
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  value="รถโดยสาร"
                  onChange={() => handleCheckboxChange('รถโดยสาร')}
                />
                รถโดยสาร
              </label>
            </div>

            <hr></hr>

            <h2>ปลายทาง</h2>

            <div>
              <label>
                <input
                  type="checkbox"
                  value="ปากช่อง"
                />
                ปากช่อง
              </label>
            </div>

            
          </div>
          <div className="promotion-product">
            <div className="box-Sightseeing">
              <div>
                <div className="box-Sightseeing-rox">
                  {famous?.map((todo, i) => (
                    <div
                      key={i}
                      className="Sightseeing-card"
                      onClick={() => handleConfirmhotellog(todo.id)}
                    >
                      <h3 className="Sightseeing-h3">
                        {todo.Timetablestart} - {todo.Timetableout}
                      </h3>
                      <p className="Sightseeing-a">
                        จุดจอดรถ: {todo.parkingspot} [ <a href={todo.map}>map</a> ]
                      </p>
                      <p className="Sightseeing-a">เบอร์โทร: {todo.Phonenumber} </p>
                      <p className="Sightseeing-a">
                        เวลา: {todo.Time} <p className="Sightseeing-a">ราคา: {todo.Price}</p>{' '}
                      </p>
                      <p className="Sightseeing-a">หมายเหตุ: {todo.note} </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sightseeing;
