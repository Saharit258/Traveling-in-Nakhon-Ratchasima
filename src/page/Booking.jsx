import React from 'react'
import Nav from '../navigation/Nav'
import '../pagecss/Booking.css'

function Booking() {
  return (
    <>
        <Nav />
        <div >
          
        <div className="search-card-book">
                        <div className="line-hotel">
                            <p>ชื่อที่พัก/สถานที่</p>
                            <input type="search" id="gsearch" className="gsearch-hotel"></input>
                            </div>
                        <div className="chack-in">
                            <p>เช็คอิน</p>
                            <input type="date" id="birthday" className="birthday"></input>
                        </div>
                        <div className="chack-out">                            
                            <p>เช็คเอาท์</p>
                            <input type="date" id="birthday" className="birthday"></input>
                        </div>
                        <div className="chack-person">
                            <p>ผู้ใหญ่</p>
                            <select className="cars" id="cars">
                                <option value="volvo">1</option>
                                <option value="saab">2</option>
                                <option value="opel">3</option>
                                <option value="audi">4</option>
                            </select>
                        </div>
                        <div className="chack-sun">
                        <p>เด็ก</p>
                            <select className="cars" id="cars">
                                <option value="volvo">1</option>
                                <option value="saab">2</option>
                                <option value="opel">3</option>
                                <option value="audi">4</option>
                            </select>
                        </div>
                        <div className="chack-button">
                            <button>ตกลง</button>
                        </div>
                    </div>

        </div>
    </>
  )
}

export default Booking