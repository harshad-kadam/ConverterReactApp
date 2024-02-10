// Footer.js
import React from 'react';
import heartIcon from '../../Assets/love.png'
import coffeeIcode from '../../Assets/coffee.png'
import './Footer.css';
const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 Harshad Kadam&lsquo;s API. All rights reserved.</p>
      <p>Made with 
      <img src={coffeeIcode} alt="" style={{ position: 'relative', width: '20px' }} />
      <span> and </span>
      <img src={heartIcon} alt="" style={{ position: 'relative', width: '20px' }} />
      </p>
    </footer>
  );
};

export default Footer;
