import React from 'react';
import HomeHero from '../components/HomeHero';
import TwoCompartmentBox from '../components/BenefitsSection';
import MockupComparison from '../components/MockupComparison';

function Homepage() {
  return (
    <>
      <HomeHero />
      <TwoCompartmentBox />
      <MockupComparison />
    </>
  );
}

export default Homepage;
