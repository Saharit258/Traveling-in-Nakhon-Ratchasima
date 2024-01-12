import React, { useState, useEffect } from 'react';
import Nav from './NavAdmin';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap'; 
import './admincss/HotelAdmin.css';

function HotelAdmin() {
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProfileUid, setSelectedProfileUid] = useState(null);
  const [problemp, setProblemp] = useState('');
  const [problemsusubjectp, setProblemsusubjectp] = useState('');

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'hotels'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDataFromFirestore(fetchedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowModal = (uid) => {
    setSelectedProfileUid(uid);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProfileUid(null);
    setShowModal(false);
  };

  const addProblems = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(firestore, 'hotels', selectedProfileUid, 'probiemp'), {
        problemp: problemp,
        problemsusubjectp: problemsusubjectp,
        time: new Date().toLocaleString(),
      });
      console.log('Problem ID: ', docRef.id);
      alert('ส่งแล้ว');
      handleCloseModal(); 
    } catch (e) {
      console.error('Error', e);
    }
  };

  const sortedProfiles = [...dataFromFirestore].sort(
    (a, b) => a.startdate.seconds - b.startdate.seconds
  );

  const filteredProfiles = sortedProfiles.filter(
    (profile) =>
      profile.pname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Nav />

      <div className="card-Hotel">
        <h2>ที่พักทั้งหมด</h2>
        <div className="search-container-hotel">
          <input type="text" placeholder=" ค้นหา" value={searchTerm} onChange={handleSearch} />
          <FontAwesomeIcon className="search-container-hotel-icon" icon={faSearch} />
        </div>
      </div>

      <div className="box-container-promotion">
        <table className="table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อโรงแรม</th>
              <th>ที่อยู่ติดต่อ</th>
              <th>เอกสาร</th>
              <th>วันที่จดทะเบียน</th>
              <th>วันที่สิ้นสุดทะเบียน</th>
              <th>แจ้งปัญหา</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <p className="loading-Conhotel">
                <div className="spinner-border" role="status">
                  <span className="sr-only"></span>
                </div>
              </p>
            )}


            {!isLoading &&
              filteredProfiles.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.pname}</td>
                  <td>{item.email}</td>
                  <td>---</td>
                  <td>{new Date(item.startdate.seconds * 1000).toLocaleDateString()}</td>
                  <td>{new Date(item.enddate.seconds * 1000).toLocaleDateString()}</td>
                  <td>
                    <button className="problemmp-ad" onClick={() => handleShowModal(item.id)}>แจ้งปัญหา</button>
                    <Modal
                      show={showModal}
                      onHide={handleCloseModal}
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header closeButton>
                        <Modal.Title><h2>แจ้งปัญหา</h2></Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <form onSubmit={addProblems}>
                              <div className="from-problemp">
                                <label>
                                  <input
                                  className='modal-problemp'
                                    type="text"
                                    placeholder=' เรื่อง'
                                    value={problemp}
                                    onChange={(e) => setProblemp(e.target.value)}
                                  />
                                </label>
                                <br />
                                <label>
                                  <textarea
                                    rows={8}
                                    className='modal-problemps'
                                    placeholder=' รายระเอียด'
                                    value={problemsusubjectp}
                                    onChange={(e) => setProblemsusubjectp(e.target.value)}
                                  />
                                </label>
                                <br />
                                </div>
                                <div className='button-problemp'>
                                <button className='button-problemp-ko' type="submit">ตกลง</button>
                                <button className='button-problemp-no' onClick={handleCloseModal}>ยกเลิก</button>
                                </div>
                              </form>
                            </Modal.Body>
                    </Modal>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default HotelAdmin;
