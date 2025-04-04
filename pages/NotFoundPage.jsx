// src/pages/NotFoundPage.js (veya istediğiniz bir klasör/isim)
import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import notFoundImage from '../src/images/404-image.jpg'; // Resmin doğru yolunu belirttiğinizden emin olun
import '../src/assets/NotFoundPage.css'; // Özel CSS dosyamızı import ediyoruz

const NotFoundPage = () => {
    return (
        // Tüm sayfayı kaplayan ve içeriği ortalayan bir sarmalayıcı
        <div className="not-found-page-wrapper">
            

            {/* Ana İçerik Alanı */}
            <Container className="not-found-container">
                <Row className="align-items-center justify-content-center">
                    {/* Resim Alanı (Tablet ve üzeri ekranlarda solda) */}
                    <Col md={6} className="text-center order-md-1 mb-4 mb-md-0">
                        <Image src={notFoundImage} alt="Sayfa bulunamadı illüstrasyonu" className="not-found-image" fluid />
                    </Col>

                    {/* Metin Alanı (Tablet ve üzeri ekranlarda sağda) */}
                    <Col md={6} className="d-flex flex-column justify-content-center text-center text-md-start order-md-2">
                        <div className="not-found-header mb-3">
                            <h1>404</h1>
                            <h3>Sayfa Bulunamadı!</h3> {/* Türkçe'ye çevirdim, isterseniz orijinali kullanın */}
                        </div>
                        <div className="not-found-footer">
                            <p className='mb-4'>
                                Üzgünüz, istediğiniz sayfa bulunamadı. Lütfen ana sayfaya geri dönün!
                                {/* Türkçe'ye çevirdim */}
                            </p>
                            <div className="d-grid d-md-block"> {/* Mobil tam genişlik, MD üzeri normal */}
                                <Button as={Link} to="/" variant="warning" size="lg" className="go-home-button">
                                    ANA SAYFAYA DÖN
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NotFoundPage;