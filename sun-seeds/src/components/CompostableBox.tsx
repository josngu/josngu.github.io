import React from 'react';
import boxCompartments from '../images/box-compartments.webp';

function CompostableBox() {
  return (
    <section>
      <div className='rl-two-columns'>
        <div>
          <img src={boxCompartments} alt='An opened sunflower seeds box with two compartments'/>
        </div>
        <div>
          <h2>Eco-Friendly Packaging</h2>
          <p>Made without low-density polyethylene plastics, our paperboard box alternative ensures that you can snack guilt-free!</p>
        </div>
      </div>
    </section>
  );
}

export default CompostableBox;
