import React from 'react';
import { Card, Container, Row, Col, Image } from 'react-bootstrap';
import { motion } from 'framer-motion'; // Framer Motion'ı import et
import '../assets/PlatformCard.css';
import HepsiburadaLogo from '../images/hepsiburadaLogo.jpg';
import TrendyolLogo from '../images/trendyol-logo.png';
import N11Logo from '../images/N11Logo.jpg';

const PlatformCard = () => {
  // Kartlar için animasyon varyantları
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

  // Resim için hover animasyonu varyantları
  const imageVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <Container className="mt-5 mb-3 p-4 bg-very-light">
      <Row className="justify-content-center">
        {/* Hepsiburada Kartı */}
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Card className="logo-card">
              <motion.div variants={imageVariants} initial="initial" whileHover="hover">
                <a href='https://www.hepsiburada.com/magaza/senole' target='_blank'><Image src={HepsiburadaLogo} fluid className="logo hepsiburada-logo" /></a>  
              </motion.div>
            </Card>
          </motion.div>
        </Col>

        {/* Trendyol Kartı */}
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Card className="logo-card">
              <motion.div variants={imageVariants} initial="initial" whileHover="hover">
                <a href='https://www.trendyol.com/magaza/senole-dogal-lezzetler-m-739122?sst=0' target='_blank'><Image src={TrendyolLogo} fluid className="logo trendyol-logo" /></a>
              </motion.div>
            </Card>
          </motion.div>
        </Col>

        {/* N11 Kartı */}
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1}}
          >
            <Card className="logo-card">
              <motion.div variants={imageVariants} initial="initial" whileHover="hover">
                <a href='https://www.n11.com/magaza/senole' target='_blank'><Image src={N11Logo} fluid className="logo n11-logo" /></a>
              </motion.div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default PlatformCard;