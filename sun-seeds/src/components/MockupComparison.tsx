import React from 'react';
import boxFrontRetailBefore from '../images/box-front-retail-before.webp';
import boxFrontRetailAfter from '../images/box-front-retail-after.webp';
import boxBackRetailBefore from '../images/box-back-retail-before.webp';
import boxBackRetailAfter from '../images/box-back-retail-after.webp';
import 'two-up-element/dist/two-up';

//Extend IntrinsicElements interface; for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'two-up': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

function MockupComparison() {
  return (
    <div className='mockup-two-columns'>
      <two-up>
        <div>
          <img
            src={boxFrontRetailBefore}
            alt='A white box with two compartments'
          />
        </div>
        <div>
          <img
            src={boxFrontRetailAfter}
            alt='A sunflower seeds box with two compartments'
          />
        </div>
      </two-up>
      <two-up>
        <div>
          <img
            src={boxBackRetailBefore}
            alt='A white box with two compartments'
          />
        </div>
        <div>
          <img
            src={boxBackRetailAfter}
            alt='A sunflower seeds box with two compartments'
          />
        </div>
      </two-up>
    </div>
  );
}

export default MockupComparison;
