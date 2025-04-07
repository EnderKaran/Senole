import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ZeytinImage from '../images/ZeytinImage.webp';
import ZeytinYagiImage from '../images/ZeytinYagiImage.webp';
import { Link } from 'react-router-dom';
import '../assets/Cards.css'; // SCSS dosyasını import et

const cardData = [
  {
    title: 'Zeytin Çeşitleri',
    description: 'En doğal zeytin çeşitleri. Online alışverişe özel indirimli!',
    image: ZeytinImage,
    alt: 'Zeytin Çeşitleri',
  },
  {
    title: 'Zeytinyağı Çeşitleri',
    description: 'Soğuk sıkım, erken hasat, en kaliteli zeytinyağı çeşitleri.',
    image: ZeytinYagiImage,
    alt: 'Zeytinyağı Çeşitleri',
  },
];

const ProductCards = () => {
  // Framer Motion varyantları (animasyonları tanımlar)
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },  // Başlangıçta aşağıda ve görünmez
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 }, // Yay efekti
    }
  };

  const imageVariants = {
    hover: { scale: 1.05,  transition: { duration: 0.3, ease: "easeInOut" } }
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>  {/* Bütün içeriği kapsayan Container */}
      <Grid container spacing={3} justifyContent="center">
        {cardData.map((item, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }} //  Viewport'a girince tetiklen, %20'si görünürse
              variants={cardVariants}
            >
              <Card className="product-card">
                <motion.div variants={imageVariants} whileHover="hover">
                <Link to="/Products">
                <CardMedia
                  component="img"
                  alt={item.alt}
                  image={item.image}
                  className="product-card__image" // Resme sınıf ekledik
                />
                </Link>
                </motion.div>
                <CardContent className="product-card__content">
                  <Typography variant="h5" component="h2" className="product-card__title">
                   <div className='text'>{item.title}</div>
                  </Typography>
                  <Typography variant="body1" className="product-card__description">
                    <div className='text'>{item.description}</div>
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductCards;