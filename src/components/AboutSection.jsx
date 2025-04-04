import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../assets/AboutSection.css';
import helalSertifikasi from '../images/helal-belgesi.jpg';
import isoSertifikasi from '../images/iso-22000.jpg';

const AboutPage = () => {
    const certificates = [
        {
            logo: helalSertifikasi,
            title: 'Helal Sertifikası',
            description: 'Helal sertifikalama, mutemet, ehil ve tarafsız bir kurumun, söz konusu üretimi denetlemesini, helal standartlarla uygunluk içerisinde üretimin yapıldığını teyit etmesi ve buna bağlı olarak, onaylanmış bir belge vermesidir.',
        },
        {
            logo: isoSertifikasi,
            title: 'ISO 22000 Gıda Güvenliği Yönetim Sistemi',
            description: 'Bir gıda zincirinde hammaddede temininden başlayarak, gıda hazırlama, işleme, üretim, ambalajlama, depolama ve nakliye gibi zincirin her aşamasında tehlike analizleri yaparak, gerekli yerlerde kritik kontrol noktalarını belirleyen bir gıda güvenliği sistemidir.',
        }
    ];

    return (
        
        <>
         
            <Container className="py-5 sectioncolor1">
           
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Row className="mb-4">
                        <Col md={12}>
                            <h1 className="text-center mb-5">Hakkımızda</h1>
                            <Card className="shadow-sm border-0">
                                <Card.Body className='cardbody'>
                                    <Card.Title className="mb-3 sectioncolor2">Markamız SenOlé</Card.Title>
                                    <Card.Text className='cardtext'>
                                        20 yılı aşkın bir süredir Türkiye'nin önde gelen gıda firmalarından modern üretim tesisleri kuran, geleneksel lezzetleri koruyup en doğal hali ile sağlıklı gıda üretimini kendisine ilke edinmiş ŞENOL ailesi tarafından 2009 yılında kurulmuştur.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </motion.div>
                
                <hr className="my-5 border-color"/>
                <h1 className="text-center mb-5 sectioncolor4">Sertifikalarımız</h1>
                {certificates.map((cert, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Row className="mb-4">
                            <Col md={12}>
                                <Card className="shadow-sm border-0">
                                    <Card.Body className='cardbody'>
                                        <Row>
                                            <Col md={2} className="d-flex align-items-center justify-content-center">
                                                <img src={cert.logo} alt={`${cert.title} Logo`} style={{ maxWidth: '150px', maxHeight: '150px' }}/>
                                            </Col>
                                            <Col md={10}>
                                                <Card.Title className="mb-3 cardtitle">{cert.title}</Card.Title>
                                                <Card.Text className='cardtext'>{cert.description}</Card.Text>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </motion.div>
                ))}
            </Container>
        </>
    );
};

export default AboutPage;
