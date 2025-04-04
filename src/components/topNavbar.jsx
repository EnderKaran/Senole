import React, { useState, useEffect } from 'react';
import '../assets/topNavbar.css';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion'; // Framer Motion'ı import et

const TopNavbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 50; // İlk 50px'de her zaman göster

            setPrevScrollPos(currentScrollPos);
            setVisible(isVisible);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);


    const topNavbarVariants = {
      visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
      hidden: { y: '-100%', opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
  };


  return (
    <motion.div
        className='top-navbar'
        style={{ position: 'fixed', width: '100%', zIndex: '1001' }} // zIndex'i navbar'dan daha yukarı taşı
        variants={topNavbarVariants}
        animate={visible ? "visible" : "hidden"}
    >
      <div className='icons'>
        <div className='icon'>
          <a href="https://www.instagram.com/senole.estore/" target='_blank' rel="noopener noreferrer"><InstagramIcon /></a>
        </div>
        <div className='icon'>
          <a href="https://www.facebook.com/SenOle.estore/" target='_blank' rel="noopener noreferrer"><FacebookIcon /></a>
        </div>
        <div className='icon'>
          <a className='wp-color' href="https://wa.me/905367440106" target='_blank' rel="noopener noreferrer"><WhatsAppIcon />Whatsapp Sipariş Hattı</a>
        </div>
      </div>
    </motion.div>
  );
};

export default TopNavbar;