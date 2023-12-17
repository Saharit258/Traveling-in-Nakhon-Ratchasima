import React from 'react'
import Nav from '../navigation/Nav'
import '../pagecss/Booking.css'
import { Button } from 'react-bootstrap';

function Booking() {
  return (
    <>
        <Nav />
        <div className='box-book' >
          
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

                    <div className="combox">
                        <div className="lef">

                        <div className="book-sidebar">
              <h2>โปรโมชั่นต่างๆ</h2>

              <div>
                  <label>
                    <input
                      type="radio"
                      value="คูปองส่วนลด"
                    />
                    คูปองส่วนลด
                  </label>
              </div>

              <div>
                  <label>
                    <input
                      type="radio"
                      value="แคมเปญพิเศษ"
                    />
                    แคมเปญพิเศษ
                  </label>
              </div>
              </div>
                        </div>
                        <div className="fi">
                        <div className="book-item">
                            <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                            <p>Promotion</p>
                            <Button className='button-book'>รับส่วนลด</Button>
                        </div>

                        <div className="book-item">
                            <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                            <p>Promotion</p>
                            <Button className='button-book'>รับส่วนลด</Button>
                        </div>

                        </div>
                    </div>

        </div>
    </>
  )
}

export default Booking