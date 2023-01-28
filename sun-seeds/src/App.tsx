import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import HomeHero from './components/HomeHero';
import Footer from './components/Footer';
import TwoCompartmentBox from './components/BenefitsSection';
import MockupComparison from './components/MockupComparison';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Footer />
    </Router>
  );
}

export default App;

/*
    <>
      <NavigationBar />
      <HomeHero />
      <TwoCompartmentBox />
      <MockupComparison />
      
    </>
*/