import React, { useState, useEffect } from 'react';
import { Container, Row, Col , Nav } from 'react-bootstrap';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import '../assets/Footer.css';

const ModernFooter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const cardVariants = {
    offscreen: { y: 50, opacity: 0 }, // Başlangıçta aşağıda ve görünmez
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.2, // Her kart için hafif bir gecikme (isteğe bağlı)
      },
    },
  };

  return (
    <motion.div
        variants={cardVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
    >

    <footer className="modern-footer">
      <Container>
        <Row className="footer-row">
          <Col xs={6} sm={3} className="footer-item">
            <div className="footer-icon-wrapper">
            <NavLink to="/"> <HomeIcon className="footer-icon" /></NavLink>
                <Nav.Link as={NavLink} to="/" className='footer-link-text' aria-label="Anasayfa"><span className="footer-text">Anasayfa</span></Nav.Link>
            </div>
          </Col>
          <Col xs={6} sm={3} className="footer-item">
            <div className="footer-icon-wrapper">
            <NavLink to="/About"> <InfoIcon className="footer-icon" /></NavLink>
                <Nav.Link as={NavLink} to="/About" className='footer-link-text' aria-label="Hakkımızda"><span className="footer-text">Hakkımızda</span></Nav.Link>    
            </div>
          </Col>
          <Col xs={6} sm={3} className="footer-item">
            <div className="footer-icon-wrapper">
              <NavLink to="/Products"> <ShoppingBasketIcon className="footer-icon" /></NavLink>
                <Nav.Link as={NavLink} to="/Products" className='footer-link-text' aria-label="Ürünler"><span className="footer-text">Ürünler</span></Nav.Link>          
            </div>
          </Col>
          <Col xs={6} sm={3} className="footer-item">
            <div className="footer-icon-wrapper">
               <NavLink to="/Contact"> <ContactMailIcon className="footer-icon" /></NavLink>
                <Nav.Link as={NavLink} to="/Contact" className='footer-link-text' aria-label="İletişim"><span className="footer-text">İletişim</span></Nav.Link>   
            </div>
          </Col>
        </Row>
        
        {/* Copyright Notice */}
        <Row className="copyright-row">
          <Col className="text-center copyright-text">
            © {currentYear} SenOlé. Tüm Hakları Saklıdır.
          </Col>
        </Row>
      </Container>
      
      {isVisible && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <KeyboardArrowUpIcon className="scroll-icon" />
        </div>
      )}
    </footer>
    </motion.div>
  );
};

export default ModernFooter;