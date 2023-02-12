import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      Copyright &copy; {currentYear} Joseph Nguyen, Breanna Schuler, Katrin
      Manayev, Drewmore Moon. All rights reserved.
    </footer>
  );
}

export default Footer;
