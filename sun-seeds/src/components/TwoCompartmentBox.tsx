import React from 'react';
import boxOrthographicLines from '../images/box-orthographic-lines.svg';

function TwoCompartmentBox() {
  return (
    <div className='container-two-columns'>
      <div>
        <img src={boxOrthographicLines} alt='An opened sunflower seeds box with two compartments'/>
      </div>
      <div>
        <h2>SUN SEEDS</h2>
        <p id='subtitle-home'>Dual compartment design allows for clean disposal of seed shells</p>
      </div>
    </div>
  );
}

export default TwoCompartmentBox;
