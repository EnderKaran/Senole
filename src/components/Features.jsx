// FeaturesSection.js
import React from 'react';
import { Grid, Card, CardContent, Typography, useTheme } from '@mui/material'; // useTheme ekledik
import { Payment, Lock, Verified, ThumbUp } from '@mui/icons-material';
import { motion } from 'framer-motion'; // Framer Motion'ı import ettik
import '../assets/FeaturesSection.css';

const Features = [
  { icon: <Payment className='payment' />, title: 'Kapıda Ödeme', description: 'Kapınıza Kadar Teslim' },
  { icon: <Lock className='lock' />, title: '%100 Güvenli Alışveriş', description: '128 Bit SSL Sertifikası' },
  { icon: <Verified className='Verified' />, title: '%100 Kaliteli Ürün', description: 'Kaliteli Ürün Güvencesi' },
  { icon: <ThumbUp className='ThumbUp' />, title: '%100 Müşteri Memnuniyeti', description: 'Müşteri Memnuniyeti' },
];

const FeaturesSection = () => {
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

  const theme = useTheme(); // Material UI temasını alıyoruz

  return (
    <Grid container spacing={3} justifyContent="center" sx={{ padding: '2rem 1rem' }}>
      {Features.map((feature, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <motion.div
          variants={cardVariants}
          initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
          >
          <Card
            className="feature-card" // Özel CSS sınıfımızı ekledik
            sx={{
              height: '100%', // ÖNEMLİ: Kartların aynı yükseklikte olması için
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              p: 3,
              borderRadius: 3,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)', // Hafif yukarı kaydırma
                boxShadow: theme.shadows[8], // Temadan gelen gölgeyi kullan
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              {/* İkonu bir div içine alıp, ortalıyoruz ve renklendiriyoruz */}
              <div className="feature-card__icon-container">
                {React.cloneElement(feature.icon, {
                  sx: {
                    fontSize: { xs: 40, sm: 50 }, // Responsive ikon boyutu
                  },
                })}
              </div>
              <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mt: 2 }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <div className='description'>{feature.description}</div>
              </Typography>
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturesSection;