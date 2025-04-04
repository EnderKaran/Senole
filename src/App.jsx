import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "./ThemeContext";
import NotFoundPage from '../pages/NotFoundPage'; // Direkt import
import Home from '../pages/Home';
import About from '../pages/AboutUs';
import Product from '../pages/Products';
import Contact from '../pages/Contact';
import { SpeedInsights } from "@vercel/speed-insights/next"


function App() {
  return (
    <>  
    <ThemeProvider>
        <Routes>
          {/* Özel Rotalarınız */}
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Products" element={<Product />} />
          <Route path="/Contact" element={<Contact />} />

          {/* --- 404 Rotası --- */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
        </ThemeProvider>
        <SpeedInsights />
    </>
  );
}

export default App;