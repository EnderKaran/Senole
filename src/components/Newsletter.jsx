import React from 'react';
import { Container, Row , Col, Form, Button , InputGroup } from 'react-bootstrap';
import { Send, Facebook, Instagram, WhatsApp, YouTube } from '@mui/icons-material';
import { motion } from 'framer-motion';
import '../assets/newsletter.css';


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


const Newsletter = () => {
    return (
        <motion.div
          variants={cardVariants}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
        >
        <Container fluid className='newsletter-section py-5'>
            <Row className='justify-content-center'>
                <Col xs={12} md={8} lg={6} className='text-center'>
                    <h2 className='newsletter-section__title'>E-Bülten</h2>
                    <p className='newsletter-section__subtitle'>
                    Fırsat & indirimlerden haberdar olmak için E-Bültene kayıt ol! 
                    </p>
                    <Form>
                        <InputGroup className='mb-3'>
                            <Form.Control
                                placeholder="E-posta adresinizi yazın..."
                                aria-label="E-posta adresi"
                                aria-describedby="basic-addon2"
                                className="newsletter-section__input"
                            />
                                    <Button href='mailto:bilgi@senole.com' aria-label="E-posta ile iletişim kur" variant="primary" id="button-addon2" className="newsletter-section__button">
                                <Send />
                            </Button>
                        </InputGroup>
                    </Form>
                    <div className="newsletter-section__social-icons">
                        <span className='social-title'>#sosyal medyada takip et!</span>
                        <a href="https://www.facebook.com/SenOle.estore/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <Facebook className="social-icon social-icon--facebook" />
                        </a>
                        <a href="https://www.instagram.com/senole.estore/" target="_blank" rel="noopener noreferrer" aria-label="İnstgram">
                        <Instagram className="social-icon social-icon--instagram" />
                        </a>
                        <a href="https://wa.me/905367440106" target="_blank" rel="noopener noreferrer" aria-label="Whatsapp">
                        <WhatsApp className="social-icon social-icon--whatsapp" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                        <YouTube className="social-icon social-icon--youtube" />
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
        </motion.div>
    )
}

export default Newsletter;