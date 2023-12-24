import React, { useState, useEffect } from 'react';
import Nav from '../navigation/Nav';
import { collection, addDoc, getDocs, } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { Button } from 'react-bootstrap';
import '../pagecss/Test.css'

function Test() {

  return (
    <>
      <Nav />
      <div>

       <div className="card">
          <h2>โปรโมชันและสิทธิพิเศษ</h2>
        </div>

        <div className="box-container-promotion">
            <div className="promotion-sidebar">
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

            <div className="promotion-product">

              <div className="promotion-item">
                <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                <p>Promotion</p>
                <Button className='button-promotion'>รับส่วนลด</Button>
              </div>

              <div className="promotion-item">
                <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                <p>Promotion</p>
                <Button className='button-promotion'>รับส่วนลด</Button>
              </div>

              <div className="promotion-item">
                <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                <p>Promotion</p>
                <Button className='button-promotion'>รับส่วนลด</Button>
              </div>

            </div>
          </div>
        </div>
    </>
  );
}

export default Test;