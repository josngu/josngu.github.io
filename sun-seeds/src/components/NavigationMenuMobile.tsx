import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../logo.svg';

interface navigationMenuMobile {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavigationMenuMobile({ isOpen, setIsOpen }: navigationMenuMobile) {
  const location = useLocation();
  let navMenuClass = '';

  if (isOpen === false) {
    navMenuClass = 'nav-menu-slide-out';
  } else {
    navMenuClass = 'nav-menu-slide-in';
  }

  return (
    <nav id='navigation-menu-mobile' className={navMenuClass}>
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
              location.pathname === '/3d-model' ? 'nav-link active' : 'nav-link'
            }
            to='/3d-model'
          >
            View 3D Model
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationMenuMobile;
