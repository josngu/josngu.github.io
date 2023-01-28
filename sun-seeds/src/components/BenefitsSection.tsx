import React from 'react';
import boxTopDown from '../images/box-top-down.webp';

function BenefitsSection() {
  return (
    <section>
      <div className='rl-two-columns'>
        <div>
          <div className='benefit-point'>
            <h2>Dual Compartment Design</h2>
            <p>Our dual compartment design allows for the clean disposal of sunflower seed shells.</p>
          </div>
          <div className='benefit-point'>
            <h2>Compostable Packaging</h2>
            <p>With the artwork printed with water-based inks* and our packaging being made without traditional low-density polyethylene plastics, our paperboard box alternative ensures that you can snack guilt-free!</p>
          </div>
          <div className='benefit-point'>
           <h2>Accessible Design</h2>
           <p>Our design features familiar tuck-end tabs, without making the shell disposal process unnecessarily complex.</p>
          </div>
        </div>
        <div>
          <img src={boxTopDown} alt='A top down view of a sunflower seeds box with two compartments'/>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
