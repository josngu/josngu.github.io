import React from 'react';
import boxCompartments from '../images/box-compartments.webp';

function TwoCompartmentBox() {
  return (
    <section>
      <div className='container-two-columns'>
        <div>
          <img src={boxCompartments} alt='An opened sunflower seeds box with two compartments'/>
        </div>
        <div>
          <h2>Dual-Compartment Design</h2>
          <p>Our dual compartment design allows for<br />the clean disposal of sunflower seed shells.</p>
        </div>
      </div>
    </section>
  );
}

export default TwoCompartmentBox;
