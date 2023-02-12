import React from 'react';
import boxOrthographicLines from '../images/box-orthographic-lines.svg';
import boxOrthographicFront from '../images/box-orthographic-front.svg';
import boxOrthographicLeftLid from '../images/box-orthographic-left-lid.svg';
import boxOrthographicRightLid from '../images/box-orthographic-right-lid.svg';
import boxOrthographicSide from '../images/box-orthographic-side.svg';

import Button from './Button';

function HomeHero() {
  return (
    <div className='container-bg'>
      <div>
        <h1 id='title-home'>SUN SEEDS</h1>
        <p id='subtitle-home'>Sunflower Seeds Packaging Mockup</p>
        <p id='sales-pitch'>
          Craving a healthy, crunchy snack but don't want to deal with the mess?
          Look no further! Sun Seeds' sunflower seeds are seasoned to your
          liking with a new packaging design that upholds the value of
          convenience for on-the-go customers.
        </p>
        <Button url='#/3d-model' text='View 3D model' />
      </div>
      <div id='hero-images'>
        <img
          src={boxOrthographicLines}
          alt='Sunflower seeds packaging mockup frame'
        />
        <img
          src={boxOrthographicFront}
          alt='Sunflower seeds packaging mockup graphics'
        />
        <img src={boxOrthographicLeftLid} alt='' />
        <img src={boxOrthographicRightLid} alt='' />
        <img src={boxOrthographicSide} alt='' />
      </div>
    </div>
  );
}

export default HomeHero;
