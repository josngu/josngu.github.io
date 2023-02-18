import React from 'react';
import embellishmentCenter from '../images/footer-embellishment-center.svg';
import embellishmentEnd from '../images/footer-embellishment-end.svg';
import embellishmentLine from '../images/footer-embellishment-line.svg';

function FooterEmbellishment() {
  return (
    <div id='footer-embellishment-container'>
      <div>
        <img src={embellishmentEnd} alt='' />
      </div>
      <div>
        <img src={embellishmentLine} alt='' />
      </div>
      <div>
        <img src={embellishmentCenter} alt='' />
      </div>
      <div>
        <img src={embellishmentLine} alt='' />
      </div>
      <div>
        <img src={embellishmentEnd} alt='' />
      </div>
    </div>
  );
}

export default FooterEmbellishment;
