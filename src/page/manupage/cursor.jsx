import React from 'react'
import '../../pagecss/cursor.css'
import logoImage from '../../assets/logoapp.png';
import SUT from '../../assets/SUT_LOGO.png';
import DGT from '../../assets/DGT.jpg';

function cursor() {
  return (
    <div className='cursor-hover'>
      <div className='cursor-card'>
        <div className="cursor-bar">
          <img className="cursor-box2-img" src={logoImage} alt="Profile" />
          <img className="cursor-box2-sut-img" src={SUT} alt="Profile" />
          <img className="cursor-box2-dgt-img" src={DGT} alt="Profile" />
        </div>

        <div className='cursor-card2'>
          <div className='cursor-text'>
          <h2>มหาวิทยาลัย</h2>
            <p>
              มหาวิทยาลัยเทคโนโลยีสุรนารี <br />
              สำนักวิชาศาสตร์และศิลป์ดิจิทัล <br />
              สาขาวิชาเทคโนโลยีดิจิทัล
            </p>
          </div>
        </div>

        <div className='cursor-card2'>
          <div className='cursor-text'>
          <h2>ที่ปรึกษาโครงงาน</h2>
            <p>
              รองศาสตราจารย์ ดร.ศิรปัฐช์ บุญครอง <br />
              อาจารย์ ดร.ฉัตรภัสร์ ฐิติอัคราวงศ์
            </p>
          </div>
        </div>

        <div className='cursor-card2'>
          <div className='cursor-text'>
          <h2>ผู้พัฒนา</h2>
            <p>
              นางสาววันเพ็ญ คำขวา <br />
              นางสาวสุญญตา แถมวัฒนะ <br />
              นายสหฤธิ์ มีนิสัย
            </p>
          </div>
        </div>


      </div>
        <div className="cursor-bar"></div>
    </div>
  )
}

export default cursor