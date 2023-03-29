import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import FooterEmbellishment from './components/FooterEmbellishment';
import Homepage from './components/Homepage';
import DevelopmentProcessPage from './components/DevelopmentProcessPage';
import ModelViewerPage from './components/ModelViewerPage';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <NavigationBar />
      <main>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route
            path='/development-process'
            element={<DevelopmentProcessPage />}
          />
          <Route path='/3d-model' element={<ModelViewerPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </main>
      {useLocation().pathname !== '/3d-model' && <FooterEmbellishment />}
      <Footer />
    </>
  );
}

export default App;
