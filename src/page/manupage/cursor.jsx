import React from 'react'
import '../../pagecss/cursor.css'
import logoImage from '../../assets/logoapp.png';
import SUT from '../../assets/SUT_LOGO.png';
import DGT from '../../assets/DGT.jpg';

function cursor() {
  return (
    <div className='cursor-hover'>
        <div className="cursor-bar">
           <img className="cursor-box2-img" src={logoImage} alt="Profile" />
           <img className="cursor-box2-sut-img" src={SUT} alt="Profile" />
           <img className="cursor-box2-dgt-img" src={DGT} alt="Profile" />
        </div>
        <div className="cursor-bar"></div>
    </div>
  )
}

export default cursor