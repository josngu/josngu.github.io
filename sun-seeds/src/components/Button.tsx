import React from 'react';

interface button {
  url: string;
  text: string;
}

function Button({url, text}: button) {
  return (
    <a className='button' href={url}>{text}</a>
  );
}

export default Button;
