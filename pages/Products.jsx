import React from 'react';
import TopNavbar from '../src/components/topNavbar';
import Navbarr from '../src/components/Navbar'
import ProductSection from '../src/components/ProductsList';
import Features from '../src/components/Features'
import Newsletter from '../src/components/Newsletter'
import Footer from '../src/components/Footer'
import { Helmet } from 'react-helmet';

function Products() {
  return (
    <div className="products-page">
      <Helmet>
                      <title>Ürünler - SenOlé</title>
                      <meta name="description" content="SenOlé markası olarak doğal lezzetleri sofralarınıza getiriyoruz. Sağlıklı ve kaliteli üretim yapıyoruz." />
                      <meta property="og:description" content="SenOlé hakkında daha fazla bilgi edinin. Doğal lezzetler, sağlıklı üretim ve sertifikalarımızla tanışın." />
                      <meta property="og:type" content="website" />
               </Helmet>
        <header>
        <TopNavbar />
      </header>
        <nav>     
          <Navbarr />
        </nav>
        <section>
          <ProductSection />
        </section>
        <Features/>
        <Newsletter/>
      <footer>
        <Footer/>
      </footer> 
    </div>
  );
}

export default Products;