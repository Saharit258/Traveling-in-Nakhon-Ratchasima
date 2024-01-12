import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import '../partner/pagecss/Bookingpartner.css';
import { useUserAuth } from '../context/UserAuthContext';
import NavPartner from '../navigation/NavPartner';
import { useNavigate } from 'react-router-dom';

function ModalContent({ selectedBooking, onClose, onBookingAction, onPayAction }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); 
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>เข้าพัก</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>ชื่อ: {selectedBooking.name}</p>
                <p>วันที่เข้า: {formatDate(selectedBooking.checkInDate)}</p>
                <p>วันที่ออก: {formatDate(selectedBooking.checkOutDate)}</p>
                <p>การจ่ายเงิน: {selectedBooking.pay}</p>
                <div className="kub-button">
                  <button className='kub-button-1' onClick={() => onBookingAction(selectedBooking)}>
                      {selectedBooking.bookingtype === 'กำลังเข้าพัก' ? 'ออกจากห้อง' : 'เข้าพัก'}
                  </button>
                  <button className='kub-button-2' onClick={() => onPayAction(selectedBooking.id)}>จ่ายเงิน</button>
                </div>
            </Modal.Body>
        </>
    );
}

function Bookingpartners() {
    const { user } = useUserAuth();
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState({});

    const navigate = useNavigate();

    const updateBookingType = async (bookingId, newBookingType) => {
      const userDocRef = doc(firestore, 'hotels', user.uid);
      const bookingsCollectionRef = collection(userDocRef, 'hbookings');
      const bookingDocRef = doc(bookingsCollectionRef, bookingId);

      try {
          await updateDoc(bookingDocRef, {
              bookingtype: newBookingType
          });

          setData((prevData) =>
              prevData.map((booking) =>
                  booking.id === bookingId ? { ...booking, bookingtype: newBookingType } : booking
              )
          );

          console.log(`Booking type updated successfully for booking ID ${bookingId}`);
      } catch (error) {
          console.error('Error updating booking type:', error.message);
      }
  };

  const handleBookingAction = (booking) => {
      const newBookingType = booking.bookingtype === 'กำลังเข้าพัก' ? 'ออกจากห้อง' : 'กำลังเข้าพัก';
      updateBookingType(booking.id, newBookingType);
  };

    const handleShowModal = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const clickbook = () => {
        navigate("/Bookingpartner");
    }

    const fetchPosthotels = async () => {
        try {
            const userDocRef = doc(firestore, 'hotels', user.uid);
            const bookingsCollectionRef = collection(userDocRef, 'hbookings');

            const querySnapshot = await getDocs(bookingsCollectionRef);
            const bookingData = [];

            querySnapshot.forEach((doc) => {
                const booking = { id: doc.id, ...doc.data() };
                bookingData.push(booking);
            });
            console.log('Fetched bookingData:', bookingData);

            bookingData.sort((a, b) => {
                const aCheckInDate = new Date(a.checkInDate).getTime();
                const bCheckInDate = new Date(b.checkInDate).getTime();

                return aCheckInDate - bCheckInDate;
            });

            setData(bookingData);
            setFilteredData(bookingData); 
        } catch (error) {
            console.error('Error fetching booking data:', error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); 
    };

    const handleSearch = () => {
        const filtered = data.filter(item =>
            (item.roomno.includes(searchQuery) ||
            item.name.includes(searchQuery) ||
            formatDate(item.checkInDate).includes(searchQuery)) &&
            (item.bookingtype === 'ออกจากห้อง')
        );
    
        setFilteredData(filtered);
    };
    

    useEffect(() => {
        fetchPosthotels();
    }, [user]);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, data]);

    const handlePayAction = async (bookingId) => {
      const userDocRef = doc(firestore, 'hotels', user.uid);
      const bookingsCollectionRef = collection(userDocRef, 'hbookings');
      const bookingDocRef = doc(bookingsCollectionRef, bookingId);

      try {
          await updateDoc(bookingDocRef, {
              pay: 'จ่ายเงินแล้ว',
          });

          setData((prevData) =>
              prevData.map((bookingItem) =>
                  bookingItem.id === bookingId ? { ...bookingItem, pay: 'จ่ายเงินแล้ว' } : bookingItem
              )
          );

          console.log(`Payment updated successfully for booking ID ${bookingId}`);
      } catch (error) {
          console.error('Error updating payment:', error.message);
      }
  };

    return (
        <>
            <div>
                <NavPartner />

                <div className="card-Hotel">
                    <h2>ประวัติการจอง</h2>
                    <div className="search-container-hotel">
                        <input
                            type="search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FontAwesomeIcon className="search-container-hotel-icon" icon={faSearch} />
                    </div>
                    <div className='bar-card-box'>
                        <button onClick={clickbook} className='bar-card-box-h'>การจองที่พัก</button>
                        <button className='bar-card-box-h-1'>ประวัติการจอง</button>
                    </div>
                </div>

                <div className="box-container-promotion">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>ห้อง</th>
                                <th>ชื่อผู้จอง</th>
                                <th>การจ่ายเงิน</th>
                                <th>วันที่เข้า</th>
                                <th>วันที่ออก</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.roomno}</td>
                                    <td>{item.name}</td>
                                    <td>{item.pay}</td>
                                    <td>{formatDate(item.checkInDate)}</td>
                                    <td>{formatDate(item.checkOutDate)}</td>
                                    <td>{item.bookingtype}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal show={showModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
                    <ModalContent
                        selectedBooking={selectedBooking}
                        onClose={handleCloseModal}
                        onBookingAction={handleBookingAction}
                        onPayAction={handlePayAction}
                    />
                </Modal>
            </div>
        </>
    );
}

export default Bookingpartners;
