import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Homepage from './components/Homepage';
import DevelopmentProcessPage from './components/DevelopmentProcessPage';
import NextStepsPage from './components/NextStepsPage';
import ModelViewerPage from './components/ModelViewerPage';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTop from './components/ScrollToTop';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavigationBar />
      <Routes>
        <Route path='/home' element={<Homepage />} />
        <Route path='/development-process' element={<DevelopmentProcessPage />} />
        <Route path='/next-steps' element={<NextStepsPage />} />
        <Route path='/3d-model' element={<ModelViewerPage />} />
        <Route element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;