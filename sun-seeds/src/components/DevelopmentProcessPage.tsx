import React from 'react';
import BlogSection from '../components/BlogSection';
import boxSketch1 from '../images/box-sketch-1.webp';
import boxSketch2 from '../images/box-sketch-2.webp';
import dieline from '../images/first-dieline.webp';
import dielineInsert from '../images/first-dieline-insert.webp';
import dieline2 from '../images/second-dieline.webp';

function DevelopmentProcessPage() {
  return (
    <>
      <h1>Development Process</h1>
      <p id='overview-text'>Traditional sunflower seed packaging is not suitable for snacking on-the-go due to its inability to provide a convenient method for disposing of the seed shells. We were tasked to design packaging that would solve this problem.</p>
      <BlogSection 
        title="Step 1: Ideate"
        text="The first step in prototyping the packaging for sunflower seeds is to define the structural requirements of the new packaging design. The design will need an area for disposing the seed shells. The first sketch (left) uses an insert to divide the the box in half, creating two compartments. The second sketch (right) is a refinement of the first design and features the same divider but with a single dieline."
        imgURL={boxSketch1}
        altText="A pencil sketch of a box with a divider than inserts into the box"
        imgURL2={boxSketch2}
        altText2={'A pencil sketch of a box with a divider already built into it'}
      />
      <BlogSection 
        title="Step 2: Create"
        text="In this phase, we created a dieline that would fulfill the requirements that we had set. The dieline was cut using the Esko Kongsberg V20 cutting table and was assembled by hand."
        imgURL={dieline}
        altText="Dieline and art for a sunflower seed box that uses an insert to divide the inside into two compartments"
        imgURL2={dielineInsert}
        altText2='An assembled dieline that shows what the box would look like structurally'
      />
      <BlogSection 
        title="Step 3: Analyze"
        text="The first iteration of the packaging had several issues. First, the disposed shells would fall out of the box if the user tried to pour more sunflower seeds to eat. Second, the box was too thick to hold in the hand comfortably. Lastly, we did not want to ship packaging where 50% of it is empty."
        imgURL={boxSketch1}
        altText=''
        imgURL2={boxSketch1}
        altText2=''
      />
      <BlogSection 
        title="Step 4: Refine"
        text='The width of the first design was decreased from 2" to 1.5", which made it considerable more comfortable to hold. The dual compartment design was remade so that the two compartments could be created with one dieline, saving on materials. Additionally, the new design now has two tuck flaps at the top to prevent the seed disposal compartment from emptying itself whenever the user tried to pour seeds into their palm.'
        imgURL={dieline2}
        altText=""
        imgURL2={dieline2}
        altText2=""
      />
    </>
  );
}

export default DevelopmentProcessPage;
