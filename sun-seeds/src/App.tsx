import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import HomeHero from './components/HomeHero';
import Footer from './components/Footer';
import TwoCompartmentBox from './components/TwoCompartmentBox';
import MockupComparison from './components/MockupComparison';

function App() {
  return (
    <>
      <NavigationBar />
      <HomeHero />
      <MockupComparison />
      <Footer />
    </>
  );
}

export default App;
