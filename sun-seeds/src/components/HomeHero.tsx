import React from 'react';
import boxOrthographicLines from '../images/box-orthographic-lines.svg';
import boxOrthographicGraphics from '../images/box-orthographic-graphics.svg';
import Button from '../components/Button';

function HomeHero() {
  return (
    <div className='container-bg'>
      <div>
        <h1 id='title-home'>SUN SEEDS</h1>
        <p id='subtitle-home'>Sunflower Seeds Packaging Mockup</p>
        <p id='sales-pitch'>Craving a healthy, crunchy snack but don't want to deal with the mess? Look no further! Sun Seeds' sunflower seeds are seasoned to your liking with a new packaging design that upholds the value of convenience for on-the-go customers.</p>
        <Button
        url="#"
        text="Learn More"
        />
      </div>
      <div id='hero-images'>
        <img src={boxOrthographicLines} alt='Sunflower seeds packaging mockup frame'/>
        <img src={boxOrthographicGraphics} alt='Sunflower seeds packaging mockup graphics'/>
      </div>
    </div>
  );
}

export default HomeHero;
