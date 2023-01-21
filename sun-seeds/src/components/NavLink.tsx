import React from 'react';

interface navLink {
  url: string;
  text: string;
}

function NavLink({url, text}: navLink) {
  return (
    <li>
      <a href={url}>{text}</a>
    </li>
  );
}

export default NavLink;
