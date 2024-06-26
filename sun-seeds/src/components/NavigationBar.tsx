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
  const [navMenuClass, setNavMenuClass] = useState('');

  function toggleMenu() {
    setIsOpen(!isOpen);
    if (isOpen === true) {
      setNavMenuClass('nav-menu-slide-out');
    } else {
      setNavMenuClass('nav-menu-slide-in');
    }
  }

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
              tabIndex={0}
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
              tabIndex={0}
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
              tabIndex={0}
            >
              View 3D Model
            </Link>
          </li>
        </ul>
        <div id='menu'>
          <button
            id='menu-button'
            onClick={() => toggleMenu()}
            aria-label='Menu'
          >
            <img
              src={isOpen === true ? closeIcon : menuIcon}
              alt='Menu button'
            />
          </button>
        </div>
      </nav>
      <NavigationMenuMobile
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navMenuClass={navMenuClass}
        toggleMenu={toggleMenu}
      />
    </header>
  );
}

export default NavigationBar;
