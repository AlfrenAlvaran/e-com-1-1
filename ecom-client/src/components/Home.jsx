import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../style/index.css';

export default function Home(){
    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}> 
            <Navbar/>

        <section className="home" id="home">
          <div className="content">
            <h3>A Good Product for Affordable Price</h3>
            <p>
              "Discover the charm of secondhand products! Each item tells a story and offers
              a unique character that new items simply can't match. By choosing secondhand,
              you're not only saving money but also reducing waste and supporting a more sustainable future.
              Embrace the thrill of the hunt and find your next treasure today!"
            </p>
            <Link to="/Login" className="btn">Buy Now</Link>
          </div>
        </section>

        <section className="about" id="about">
          <h1 className="heading"><span>About</span></h1>
          <div className="row">
            <div className="image">
              <img src="public/cart.jpg" alt="Cart" />
            </div>
            <div className="content">
              <h3>Looking for something cheap? But a Good Quality</h3>
              <p>
                "Looking for quality without breaking the bank? Discover our collection of affordable, high-quality
                products! From stylish essentials to unique treasures, you'll find everything you need at prices that won't
                stretch your budget. Shop smart, save more, and enjoy the best of both worlds—quality and affordability—all in one place!"
              </p>
              <Link to="/About" className="btn">Learn More</Link>
            </div>
          </div>
        </section>

        <section className="products" id="products">
          <h1 className="heading"> <span>Products</span></h1>
          <div className="box-container">
            
            <div className="box">
              <img src="public/laptop-screen.png" alt="Laptops" />
              <h3>Laptops</h3>
              <div className="price">Php 1,000 <span>Php 30,000</span></div>
              <Link to="/login" className="btn">Buy Now</Link>
            </div>

            <div className="box">
              <img src="public/smart-tv.png" alt="LED TV's" />
              <h3>LED TV's</h3>
              <div className="price">Php 1,000 <span>Php 30,000</span></div>
              <Link to="/login" className="btn">Buy Now</Link>
            </div>

            <div className="box">
              <img src="public/floor-fan.png" alt="Fans" />
              <h3>Fans</h3>
              <div className="price">Php 1,000 <span>Php 30,000</span></div>
              <Link to="/login" className="btn">Buy Now</Link>
            </div>

            <div className="box">
              <img src="public/air-fryer.png" alt="Air Fryers" />
              <h3>Air Fryers</h3>
              <div className="price">Php 1,000 <span>Php 30,000</span></div>
              <Link to="/login" className="btn">Buy Now</Link>
            </div>

            <div className="box">
              <img src="public/laundry-machine.png" alt="Washing Machines" />
              <h3>Washing Machines</h3>
              <div className="price">Php 1,000 <span>Php 30,000</span></div>
              <Link to="/login" className="btn">Buy Now</Link>
            </div>

            <div className="box">
              <img src="public/rice-cooker.png" alt="Rice Cookers" />
              <h3>Rice Cookers</h3>
              <div className="price">Php 1,000 <span>Php 30,000</span></div>
              <Link to="/login" className="btn">Buy Now</Link>
            </div>
          </div>
        </section>
        </div>
    )
}