import React from 'react';
import boxFrontRetailBefore from '../images/box-front-retail-before.webp';
import boxFrontRetailAfter from '../images/box-front-retail-after.webp';
import boxBackRetailBefore from '../images/box-back-retail-before.webp';
import boxBackRetailAfter from '../images/box-back-retail-after.webp';
import 'two-up-element/dist/two-up';

//Extend IntrinsicElements interface
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'two-up':React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>,HTMLElement>;
    }
  }
}

function MockupComparison() {
  return (
    <section>
      <h2>Interactive Mockups</h2>
      <div className='mockup-two-columns'>
        <two-up>
          <div>
            <img src={boxFrontRetailBefore} alt='An opened sunflower seeds box with two compartments'/>
          </div>
          <div>
            <img src={boxFrontRetailAfter} alt='An opened sunflower seeds box with two compartments'/>
          </div>
        </two-up>
        <two-up>
          <div>
            <img src={boxBackRetailBefore} alt='An opened sunflower seeds box with two compartments'/>
          </div>
          <div>
            <img src={boxBackRetailAfter} alt='An opened sunflower seeds box with two compartments'/>
          </div>
        </two-up>
      </div>
    </section>
  );
}

export default MockupComparison;
