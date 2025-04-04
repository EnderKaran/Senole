// src/components/CertificateList.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductsSection';
import '../assets/Products.css';
import ZeytinResmi1 from '../images/zeytin-resmi1.png';
import ZeytinYagiResmi1 from '../images/zeytinyagi-resmi1.png';
import ZeytinYagiResmi2 from '../images/zeytinyagi-resmi2.png';
import ZeytinYagiResmi3 from '../images/zeytinyagi-resmi3.png';
import ZeytinYagiResmi4 from '../images/zeytinyagi-resmi4.png';
import ZeytinYagiResmi5 from '../images/zeytinyagi-resmi5.png';
import ZeytinYagiResmi6 from '../images/zeytinyagi-resmi6.png';
import ZeytinYagiResmi7 from '../images/zeytinyagi-resmi7.png';
import ZeytinYagiResmi8 from '../images/zeytinyagi-resmi8.png';
import ZeytinYagiResmi9 from '../images/zeytinyagi-resmi9.png';
import ZeytinYagiResmi10 from '../images/zeytinyagi-resmi10.png';
import ZeytinYagiResmi11 from '../images/zeytinyagi-resmi11.png';
import ZeytinYagiResmi12 from '../images/zeytinyagi-resmi12.png';

const zeytinyagiAciklama = `Senole soğuk sıkım zeytinyağımız; Bursa ili, Mudanya ilçesine bağlı tarihi TRİLYE beldesindeki asırlık zeytin ağaçlarından toplanan zeytinlerden üretilir. Dip zeytini kesinlikle kullanılmaz.`;

const initialProducts = [
    {
        id: 1, // Benzersiz ID eklemek iyi bir pratiktir
        logo: ZeytinResmi1, // helalSertifikasi,
        title: 'Sofralık Doğal Salamura Siyah Zeytin (290-320) 1 Kg',
        description: zeytinyagiAciklama,
    },
    {
        id: 2,
        logo: ZeytinResmi1, 
        title: 'Sofralık Doğal Salamura Siyah Zeytin (351-410) 1 Kg',
        description: zeytinyagiAciklama,
    },
    
    { id: 3, logo: ZeytinYagiResmi1, title: 'Erken Hasat Soğuk Sıkım Naturel Sızma Zeytinyağı 5 lt', description: zeytinyagiAciklama },
    { id: 4, logo: ZeytinYagiResmi2, title: 'Erken Hasat Soğuk Sıkım Naturel Sızma Zeytinyağı Pet Şişe 1l', description: zeytinyagiAciklama },
    { id: 5, logo: ZeytinYagiResmi3, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Özel Cam Şişe 500ml', description: zeytinyagiAciklama },
    { id: 6, logo: ZeytinYagiResmi4, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Özel Cam Şişe 250ml', description: zeytinyagiAciklama },
    { id: 7, logo: ZeytinYagiResmi5, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Özel Cam Şişe 750ml', description: zeytinyagiAciklama },
    { id: 8, logo: ZeytinYagiResmi6, title: 'Erken Hasat Soğuk Sıkım Naturel Sızma Zeytinyağı Pet Şişe 2l', description: zeytinyagiAciklama },
    { id: 9, logo: ZeytinYagiResmi7, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Özel Silindir Cam Şişe 250ml', description: zeytinyagiAciklama },
    { id: 10, logo: ZeytinYagiResmi8, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Pet Şişe 1l', description: zeytinyagiAciklama },
    { id: 11, logo: ZeytinYagiResmi9, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Teneke 5l', description: zeytinyagiAciklama },
    { id: 12, logo: ZeytinYagiResmi10, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Pet Şişe 2l', description: zeytinyagiAciklama },
    { id: 13, logo: ZeytinYagiResmi11, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Cam Şişe 250ml', description: zeytinyagiAciklama },
    { id: 14, logo: ZeytinYagiResmi12, title: 'Soğuk Sıkım Naturel Sızma Zeytinyağı Cam Şişe 500ml', description: zeytinyagiAciklama },
];
// --- Örnek Veri Sonu ---


const ProductsList = () => {
    const [Products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Veri çekme simülasyonu (API çağrısı yerine)
        const timer = setTimeout(() => {
            setProducts(initialProducts);
            setLoading(false);
        }, 1500); // 2 saniye bekleme süresi

        // Component unmount olduğunda timer'ı temizle
        return () => clearTimeout(timer);
    }, []);

    // Yüklenirken gösterilecek iskelet sayısı
    const skeletonCount = 14;

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5">Ürünlerimiz</h2>
            <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4"> {/* Sütun sayılarını ayarlayabilirsiniz (xl ekledim) */}
                {loading
                    ? Array.from(new Array(skeletonCount)).map((_, index) => (
                        <Col key={`skeleton-${index}`} className="d-flex">
                            <ProductCard loading={true} />
                        </Col>
                    ))
                    : Products.map((cert, index) => (
                        <Col key={cert.id || index} className="d-flex">
                            <ProductCard
                                Product={cert}
                                loading={false}
                                eventKey={index.toString()} // Accordion için benzersiz key
                            />
                        </Col>
                    ))}
            </Row>
        </Container>
    );
};

export default ProductsList;
