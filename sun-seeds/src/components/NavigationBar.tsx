import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import logo from '../logo.svg';
import menuIcon from '../images/menu-icon.svg';
import closeIcon from '../images/close-icon.svg';
import NavigationMenuMobile from './NavigationMenuMobile';

function NavigationBar() {
  const location = useLocation();
  // Set the state of the mobile nav menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <nav id='navigation-menu'>
        <Link to='/'>
          <img src={logo} id='logo' alt='Sun Seeds Logo' />
        </Link>
        <ul>
          <li>
            {/*If the current path is equal to the set path, change the class*/}
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
        <div id='menu'>
          <button
            id='menu-button'
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Menu'
          >
            <img src={menuIcon} alt='Menu button' />
          </button>
        </div>
      </nav>
      <NavigationMenuMobile isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}

export default NavigationBar;
