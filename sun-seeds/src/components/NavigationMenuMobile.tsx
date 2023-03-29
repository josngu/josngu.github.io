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
  navMenuClass: string;
  toggleMenu: () => void;
}

function NavigationMenuMobile({
  isOpen,
  setIsOpen,
  navMenuClass,
  toggleMenu,
}: navigationMenuMobile) {
  const location = useLocation();

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
            onClick={() => toggleMenu()}
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
            onClick={() => toggleMenu()}
            tabIndex={0}
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
            onClick={() => toggleMenu()}
            tabIndex={0}
          >
            View 3D Model
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationMenuMobile;
