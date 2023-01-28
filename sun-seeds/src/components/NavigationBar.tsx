import React from 'react';
import { BrowserRouter as Router, Route, Link, Navigate } from 'react-router-dom';
import logo from '../logo.svg';

function NavigationBar() {
  return (
    <header>
      <nav>
        <Link to='/home'>
          <img src={logo} id='logo' alt='Sun Seeds Logo'/>
        </Link>
        <ul>
          <li>
            <Link className='nav-link' to="/home">Home</Link>
          </li>
          <li>
            <Link className='nav-link' to="/development-process">Development Process</Link>
          </li>
          <li>
            <Link className='nav-link' to="/next-steps">Next Steps</Link>
          </li>
          <li>
            <Link className='nav-link' to="/3d-model">View 3D Model</Link>
          </li>
        </ul>
      </nav>
      </header>
  );
}

export default NavigationBar;
