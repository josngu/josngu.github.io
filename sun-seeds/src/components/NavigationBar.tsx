import React from 'react';
import NavLink from '../components/NavLink';
import logo from '../logo.svg';

function NavigationBar() {
  return (
    <header>
      <nav>
        <a href='index.html'>
          <img src={logo} id='logo' alt='Sun Seeds Logo'/>
        </a>
        <ul>
          <NavLink
            url={"#"}
            text={'Development Process'}
          />
          <NavLink
            url={"#"}
            text={'Next Steps'}
          />
          <NavLink
            url={"#"}
            text={'View 3D Model'}
          />
        </ul>
      </nav>
    </header>
  );
}

export default NavigationBar;
