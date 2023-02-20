import React from 'react';
import HomeHero from '../components/HomeHero';
import BenefitsSection from '../components/BenefitsSection';
import Button from '../components/Button';

function Homepage() {
  return (
    <>
      <HomeHero />
      <BenefitsSection />
      <section className='cta-section'>
        <h2>See our development process!</h2>
        <Button url='#/development-process' text='Learn more' />
      </section>
    </>
  );
}

export default Homepage;
