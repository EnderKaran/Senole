import React, { useState, useEffect } from 'react';
import { Navbar, Container, Offcanvas, Nav } from 'react-bootstrap';
import { NavLink , Outlet } from 'react-router-dom';
import SenoleLogo from '../images/senole.webp';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { motion } from 'framer-motion';
import '../assets/Navbar.css';
import '../App.css';

const Navbarr = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50;
            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    useEffect(() => {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
    
        // Dark mode açık mı kontrol et
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDarkMode);
    
        setIsDarkMode(isDark);
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    
        // Sistem temasını takip et
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
        const handleChange = (event) => {
            if (!localStorage.getItem('theme')) {
                const newMode = event.matches;
                setIsDarkMode(newMode);
                document.body.classList.toggle('dark-mode', newMode);
            }
        };
    
        darkModeMediaQuery.addEventListener('change', handleChange);
    
        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
        };
    }, []);
    
    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
    
        if (newMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
    };
    
    

    const navbarVariants = {
        visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
        hidden: { y: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
    };

    return (
        <motion.div
            variants={navbarVariants}
            animate={visible ? 'visible' : 'hidden'}
            style={{ position: 'fixed', width: '100%', zIndex: 1000 }}
        >
            <Navbar expand="lg" className={`bg-body-tertiary ${isDarkMode ? 'dark' : ''}`} fixed="top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        <img src={SenoleLogo} alt="Senole Logo" width="200" height="auto" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" aria-expanded="true" onClick={() => setShowOffcanvas(true)} />

                    <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" responsive="lg">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Menü</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="me-auto" onClick={() => setShowOffcanvas(false)}>
                                <Nav.Link as={NavLink} to="/">Anasayfa</Nav.Link>
                                <Nav.Link as={NavLink} to="/About">Hakkımızda</Nav.Link>
                                <Nav.Link as={NavLink} to="/Products">Ürünler</Nav.Link>
                                <Nav.Link as={NavLink} to="/Contact">İletişim</Nav.Link>
                                <Outlet />
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={toggleDarkMode} aria-label="Menüyü Kapat" style={{ cursor: 'pointer' }}>
                                    {isDarkMode ? <LightModeIcon className="icon" /> : <DarkModeIcon className="icon" />}
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>
                </Container>
            </Navbar>
        </motion.div>
    );
};

export default Navbarr;