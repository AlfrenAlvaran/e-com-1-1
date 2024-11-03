import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export default function Navbar() {
  // const [token, SetToken] = useState('')
  // useEffect(() => {
  //   if (localStorage.getItem('userType')) {
  //     SetToken(localStorage.setItem('userType'));
  //   }
  // }, [])

  const navigate = useNavigate()

  const handlelogout = () => {
    SetToken(null)
    localStorage.removeItem('userType')

    navigate('/')
  }
  return (

    <header className="header">
      <div className="nav-logo">
        <p>SECOND-HAND MARKETPLACE</p>
      </div>


      <nav className="navbar">
        <Link to="/" >Home</Link>
        {/* <Link to="/">About</Link>
        <Link to="/">Products</Link> */}
        <a href="#about">About</a>
        <a href="#products">Products</a>
        <Link to="/Login" className="btn">Sign In</Link>
        {/* {
          !token ?
            <Link to="/Login" className="btn">Sign In</Link>
            :
            <div className="navbar-profile">
              <img src="/icons/profile.png" alt="" />
              <ul className="nav-profile-dropdown">
                <li>
                  <img src="/icons/logout.png" alt="" />
                  Logout
                </li>
              </ul>
            </div>

        } */}
      </nav>

      <div className="icons">
        <div className="fas fa-search" id="search-btn"></div>
        <div className="fas fa-bars" id="menu-btn"></div>
      </div>

      <div className="search-form">
        <input type="search" id="search-box" placeholder="Search here..." />
        <label htmlFor="search-box" className="fas fa-search"></label>
      </div>
    </header>

  )
}