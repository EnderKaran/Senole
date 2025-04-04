import React, { useState } from 'react';
import { Card, Accordion } from 'react-bootstrap';
import Skeleton from '@mui/material/Skeleton';
import { motion } from 'framer-motion';
import '../assets/Products.css';

// --- YENİ İMPORTLAR ---
import Lightbox from "yet-another-react-lightbox"; // Lightbox bileşeni
import "yet-another-react-lightbox/styles.css"; // Gerekli stiller
// --- YENİ İMPORTLAR SONU ---

const MotionCard = motion(Card);

const ProductCard = ({ Product, loading }) => {
    const [activeKey, setActiveKey] = useState(null);
    // --- YENİ STATE ---
    const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Lightbox açık mı?
    // --- YENİ STATE SONU ---


    if (loading) {
        // İskelet kısmı aynı kalıyor...
        return (
            <Card className="certificate-card shadow-sm h-100">
                <Card.Body className="d-flex flex-column align-items-center text-center">
                    <Skeleton variant="rectangular" width={80} height={80} animation="wave" className="mb-3 certificate-logo-skeleton" />
                    <Skeleton variant="text" width="80%" height={30} animation="wave" className="mb-2" />
                    <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
                </Card.Body>
            </Card>
        );
    }

    const cardHoverVariants = {
        rest: {
            y: 0,
            scale: 1,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.3, type: "tween", ease: "easeOut" }
        },
        hover: {
            y: -6,
            scale: 1.03,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
            transition: {
                duration: 0.25,
                type: "spring",
                stiffness: 300,
                damping: 15
            }
        }
    };

    const toggleAccordion = (key) => {
        setActiveKey(prevKey => (prevKey === key ? null : key));
    };

    // --- YENİ FONKSİYON ---
    // Lightbox'ı açma fonksiyonu
    const openLightbox = () => {
        if (Product.logo) { // Sadece logo varsa aç
            setIsLightboxOpen(true);
        }
    };
    // --- YENİ FONKSİYON SONU ---

    return (
        <> {/* Lightbox'ı Card dışına render etmek için Fragment kullan */}
            <MotionCard
                className="certificate-card h-100"
                style={{ border: 'none', borderRadius: '10px', overflow: 'hidden' }}
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                layout
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Card.Body className="d-flex flex-column align-items-center text-center p-0">
                        {/* --- RESİM KONTEYNERİNE TIKLAMA EKLE --- */}
                        <div
                            className="logo-container mt-3 mb-2"
                            onClick={openLightbox} // Tıklama olayını ekle
                            style={{ cursor: Product.logo ? 'pointer' : 'default' }} // Logo varsa imleci değiştir
                        >
                            {Product.logo ? (
                                <img
                                    src={Product.logo}
                                    alt={`${Product.title} Logo`}
                                    className="certificate-logo"
                                />
                            ) : (
                                <div className="certificate-logo-placeholder"></div>
                            )}
                        </div>
                        {/* --- RESİM KONTEYNERİNE TIKLAMA SONU --- */}

                        {/* Accordion ve Card.Text kısımları aynı kalıyor */}
                        <Accordion
                            flush
                            className="w-100"
                            activeKey={activeKey}
                            // Eğer her kart kendi akordiyonunu yönetiyorsa eventKey'e gerek yok,
                            // aktifliği state ile yönetmek daha doğru.
                            // onSelect={() => toggleAccordion("0")} // Bu şekilde de kalabilir veya kaldırılabilir
                        >
                            <Accordion.Item eventKey="0" className="certificate-accordion-item">
                                {/* Header'a tıklamayı yönetmek için onClick ekleyebiliriz */}
                                <Accordion.Header
                                    onClick={() => toggleAccordion("0")}
                                    className="certificate-accordion-header justify-content-center"
                                >
                                    <span className="fw-bold text-center">{Product.title}</span>
                                </Accordion.Header>
                                <Accordion.Body className="certificate-accordion-body text-start">
                                    {Product.description}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                        <Card.Text className='card-textt'>
                            Siparişlerinizi Pazaryerlerinden verebilirsiniz!
                        </Card.Text>
                    </Card.Body>
                </motion.div>
            </MotionCard>

            {/* --- LIGHTBOX BİLEŞENİNİ EKLE --- */}
            {Product.logo && ( // Sadece logo varsa Lightbox'ı render et
                 <Lightbox
                    open={isLightboxOpen}
                    close={() => setIsLightboxOpen(false)}
                    // Gösterilecek slaytlar (bu kart için sadece 1 tane)
                    slides={[{ src: Product.logo }]}
                   
                />
            )}
            {/* --- LIGHTBOX BİLEŞENİ SONU --- */}
        </>
    );
};

export default ProductCard;