import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import logo from '../logo.svg';

function NavigationBar() {
  const location = useLocation();

  return (
    <header>
      <nav>
        <Link to='/'>
          <img src={logo} id='logo' alt='Sun Seeds Logo' />
        </Link>
        <ul>
          <li>
            <Link
              className={
                location.pathname === '/' ? 'nav-link active' : 'nav-link'
              }
              to='/'
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={
                location.pathname === '/development-process'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              to='/development-process'
            >
              Development Process
            </Link>
          </li>
          <li>
            <Link
              className={
                location.pathname === '/3d-model'
                  ? 'nav-link active'
                  : 'nav-link'
              }
              to='/3d-model'
            >
              View 3D Model
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavigationBar;
