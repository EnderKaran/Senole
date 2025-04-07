import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Container } from 'react-bootstrap';

// Swiper stilleri
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';


// Modüller
import { EffectFade, Pagination, Parallax, Navigation, Autoplay } from 'swiper/modules';
import '../assets/Slider.css'; // Slider stilleri

// Resimler
import SlideImage1 from '../images/slide1.webp';
import SlideImage2 from '../images/slide2.webp';
import SlideImage3 from '../images/slide3.webp';
import SlideImage4 from '../images/slide4.webp';
import SlideImage5 from '../images/slide5.webp';

const MySlider = () => {
  return (
    <Container fluid className="p-0">
     
        <Swiper
          modules={[EffectFade, Pagination, Parallax, Navigation , Autoplay]}
          speed={600}
          parallax={true}
          effect={'fade'}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          className="mySwiper"
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          }}
          autoplay={{ // Otomatik oynatma
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          
          // Responsive ayarları -- ÖNEMLİ
          breakpoints={{
            // 320px genişlikten itibaren
            320: {
              slidesPerView: 1, // 1 slayt göster
              spaceBetween: 10,  // Slaytlar arası boşluk (isteğe bağlı)
              // navigation: false, // Gerekirse mobile'de navigation'ı kapat
            },
            // 640px genişlikten itibaren
            640: {
              slidesPerView: 1,  // 1 slayt göster (isteğe bağlı, 1 varsayılan)
              spaceBetween: 20,
            },
            // 768px genişlikten itibaren
            768: {
              slidesPerView: 1, // 1 slayt (veya istediğiniz sayı)
              spaceBetween: 30,
            },
            // 1024px genişlikten itibaren
            1024: {
                slidesPerView: 1, // 1 slayt
                spaceBetween: 40
            }

          }}
        >
          <SwiperSlide>
            <div
              className="parallax-bg"
              style={{ backgroundImage: `url(${SlideImage1})` }}
              data-swiper-parallax="-23%"
            ></div>
            
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="parallax-bg"
              style={{ backgroundImage: `url(${SlideImage2})` }}
              data-swiper-parallax="-23%"
            ></div>
            
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="parallax-bg"
              style={{ backgroundImage: `url(${SlideImage3})` }}
              data-swiper-parallax="-23%"
            ></div>
            
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="parallax-bg"
              style={{ backgroundImage: `url(${SlideImage4})` }}
              data-swiper-parallax="-23%"
            ></div>
            
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="parallax-bg"
              style={{ backgroundImage: `url(${SlideImage5})` }}
              data-swiper-parallax="-23%"
            ></div>
            
          </SwiperSlide>
        </Swiper>
      
    </Container>
  );
};

export default MySlider;