import React, { useEffect, useRef, useState } from 'react'; // useState ekledik (tema için)
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Button, FloatingLabel } from 'react-bootstrap';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Fax';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';

// --- Leaflet Importları ---
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import L from 'leaflet'; // İkon düzeltmesi ve divIcon için
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// --- Leaflet Importları Sonu ---



import '../assets/Contact.css'; // CSS dosyamız

// --- Leaflet İkon Düzeltmesi ---
// Bu kodun bileşen render edilmeden önce çalışması önemlidir.
// Eğer birden fazla yerde tanımlanıyorsa, bu kontrolü eklemek iyi olabilir:
if (!L.Icon.Default.prototype._getIconUrl) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetinaUrl,
        iconUrl: iconUrl,
        shadowUrl: shadowUrl,
    });
}
// --- Leaflet İkon Düzeltmesi Sonu ---

// --- Özel İkonlar Oluştur ---
const createCustomIcon = (color, type) => {
    // Önemli: iconAnchor'ı ikon boyutunun yarısı yapın ki merkezlensin.
    return L.divIcon({
        className: `custom-icon ${type}-icon`, // CSS'te hedeflemek için class'lar
        html: `<div style="background-color:${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.5);"></div>`,
        iconSize: [14, 14], // Div'in boyutu + border
        iconAnchor: [7, 7]   // Boyutun yarısı
    });
};

const shopIcon = createCustomIcon('#E91E63', 'shop'); // Pembe
const restaurantIcon = createCustomIcon('#FF9800', 'restaurant'); // Turuncu
const amenityIcon = createCustomIcon('#4CAF50', 'amenity'); // Yeşil
// --- Özel İkonlar Sonu ---

// --- Motion Bileşenleri ---
const MotionContainer = motion(Container);
const MotionRow = motion(Row);
const MotionCol = motion(Col);
const MotionButton = motion(Button);
const MotionH3 = motion.h3;
const MotionP = motion.p;
const MotionMapContainerDiv = motion.div;

// --- Animasyon Varyantları ---
const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const sectionVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } }
};

const infoItemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const buttonHoverTap = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
};

//Doğrulama Şeması
const ContactSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Çok Kısa').max(50, 'Çok Uzun').required('İsim alanı zorunludur'),
    email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta alanı zorunludur'),
    subject: Yup.string().min(5, 'Konu çok kısa!').max(100, 'Konu çok uzun!').required('Konu alanı zorunludur'),
    message: Yup.string().min(10, 'Mesaj çok kısa!').required('Mesaj alanı zorunludur'),
});

// --- Harita Katmanı Bilgileri (Tema için) ---
const tileLayersData = {
    light: {
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
    },
    dark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
    },
    colorful: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
};
// --- Harita Katmanı Bilgileri Sonu ---

// --- OSM Buildings Component ---
function OSMBuildingsLayer({ theme }) {
    const map = useMap();
    const osmBuildingsRef = useRef(null);
    const isMountedRef = useRef(false); // İlk render'ı atlamak için

    useEffect(() => {
        // Global OSMBuildings nesnesini güvenli bir şekilde al
        const OSMBuildings = window.OSMBuildings;
        if (!OSMBuildings) {
            console.error("OSMBuildings is not loaded! Please add the script to your index.html.");
            return;
        }

        // OSMBuildings instance'ını yönetmek için yardımcı fonksiyon
        const initOSMBuildings = () => {
            // Önceki instance'ı temizle
            if (osmBuildingsRef.current) {
                osmBuildingsRef.current.remove();
                osmBuildingsRef.current = null;
            }

            // Yeni instance oluştur
            const osmb = new OSMBuildings(map);
            osmBuildingsRef.current = osmb;

            // OSM Buildings verilerini yükle
            osmb.load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json')
                .then(() => console.log("OSM Buildings data loaded"))
                .catch(error => console.error("Error loading OSM Buildings data:", error));


            // Tema ayarlarını uygula
            const themeSettings = theme === 'dark' ? {
                // Karanlık tema için renk ve stil ayarları
                // Bu renkler OSM Buildings belgelerine göre ayarlanabilir
                wallColor: 'rgba(40, 40, 40, 0.8)',
                roofColor: 'rgba(60, 60, 60, 0.8)',
                //baseColor: '#222222', // Eski stil, wall/roof daha iyi olabilir
                //roofColor: '#333333', // Eski stil
                highlightColor: 'rgba(255, 100, 100, 0.5)', // Örnek vurgu rengi
                shadows: true,
                minZoom: 15,
                maxZoom: 20 // Daha fazla yakınlaşmaya izin ver
            } : {
                // Açık tema için renk ve stil ayarları
                 wallColor: 'rgba(200, 190, 180, 0.9)',
                 roofColor: 'rgba(220, 210, 200, 0.9)',
                //baseColor: '#cccccc', // Eski stil
                //roofColor: '#b0b0b0', // Eski stil
                highlightColor: 'rgba(255, 100, 100, 0.5)', // Örnek vurgu rengi
                shadows: true,
                minZoom: 15,
                maxZoom: 20 // Daha fazla yakınlaşmaya izin ver
            };
            osmb.setStyle(themeSettings); // setStyle kullanmak daha modern

            // İlk görünümü ayarla (opsiyonel, eğer harita başlangıçta eğik olsun isteniyorsa)
            // osmb.setTilt(30);

            console.log(`OSMBuildings initialized with ${theme} theme.`);
        };


        // Bileşen bağlandığında ve map/theme değiştiğinde çalışır
        initOSMBuildings();
        isMountedRef.current = true;


        // OSM Buildings nesnesini global olarak erişilebilir kılmak (MapControls için)
        // Daha iyi bir yöntem context veya prop drilling olabilir, ancak basitlik için global
        window.osmbInstance = osmBuildingsRef.current;

        // Cleanup function
        return () => {
            if (osmBuildingsRef.current) {
                console.log("Removing OSMBuildings instance.");
                osmBuildingsRef.current.remove();
                osmBuildingsRef.current = null;
            }
            delete window.osmbInstance; // Global referansı temizle
        };
    }, [map, theme]); // theme değiştiğinde efekti yeniden çalıştır

    return null; // Bu bileşen DOM'a birşey render etmez
}

// --- POI (Points of Interest) Layer ---
function POILayer() {
    const map = useMap();
    const poiLayerRef = useRef(null);
    const labelsLayerRef = useRef(null); // Etiketler için ayrı katman
    const currentRequestRef = useRef(null); // Aktif isteği takip etmek için

    useEffect(() => {
        // Fonksiyon: Overpass API ile POI verilerini çek
        const fetchPOIData = async () => {
            // Eğer zaten bir istek devam ediyorsa yenisini başlatma
             if (currentRequestRef.current) {
                 console.log("POI fetch already in progress, skipping.");
                 return;
             }

            const controller = new AbortController();
            currentRequestRef.current = controller; // İstek kontrolcüsünü sakla

            try {
                const mapBounds = map.getBounds();
                const south = mapBounds.getSouth();
                const west = mapBounds.getWest();
                const north = mapBounds.getNorth();
                const east = mapBounds.getEast();

                 // Zoom seviyesini kontrol et, çok genişse istek yapma
                 if (map.getZoom() < 14) {
                     console.log("Zoom level too low, skipping POI fetch.");
                      // Mevcut POI'ları temizle
                      if (poiLayerRef.current) map.removeLayer(poiLayerRef.current);
                      if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);
                      poiLayerRef.current = null;
                      labelsLayerRef.current = null;
                     currentRequestRef.current = null; // İsteği bitir
                     return;
                 }


                // Overpass API sorgusu (daha odaklı)
                const query = `
                    [out:json][timeout:25];
                    (
                        node["shop"](${south},${west},${north},${east});
                        way["shop"](${south},${west},${north},${east});
                        node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"](${south},${west},${north},${east});
                        way["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"](${south},${west},${north},${east});
                        node["amenity"~"^(bank|pharmacy|atm|marketplace|cinema|theatre)$"](${south},${west},${north},${east});
                        way["amenity"~"^(bank|pharmacy|atm|marketplace|cinema|theatre)$"](${south},${west},${north},${east});
                        // Daha fazla POI türü eklenebilir
                    );
                    out center; // Ways için merkez nokta al
                `;

                console.log("Fetching POI data for bounds:", mapBounds);
                const response = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    body: query,
                    signal: controller.signal // AbortController sinyali
                });

                 // İstek tamamlandı veya iptal edildi, referansı temizle
                 currentRequestRef.current = null;

                if (!response.ok) {
                    throw new Error(`Overpass API error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("POI data received:", data.elements.length, "elements");

                // Mevcut POI layer'larını temizle
                if (poiLayerRef.current) map.removeLayer(poiLayerRef.current);
                if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);

                // Yeni Layer Group'lar oluştur
                const poiLayer = L.layerGroup();
                const labelsLayer = L.layerGroup(); // Etiketler için ayrı
                poiLayerRef.current = poiLayer;
                labelsLayerRef.current = labelsLayer;

                // POI verilerini işle ve layer'lara ekle
                data.elements.forEach(element => {
                     // 'center' kullanıldığında way'ler için center objesi gelir
                     const lat = element.lat ?? element.center?.lat;
                     const lon = element.lon ?? element.center?.lon;
                     const tags = element.tags;

                    if (tags && tags.name && lat && lon) {
                        let icon;
                        let category = 'other';

                        if (tags.shop) {
                            icon = shopIcon;
                            category = 'shop';
                        } else if (tags.amenity && ['restaurant', 'cafe', 'fast_food', 'bar', 'pub'].includes(tags.amenity)) {
                            icon = restaurantIcon;
                            category = 'restaurant';
                        } else if (tags.amenity) {
                            icon = amenityIcon;
                            category = 'amenity';
                        } else {
                            return; // İkonu olmayanları atla
                        }


                        // POI ikonu (marker)
                        const marker = L.marker([lat, lon], { icon: icon, opacity: 0.9, riseOnHover: true });

                        // Popup içeriği
                        let popupContent = `<div class="poi-popup"><strong>${tags.name}</strong>`;
                        if (tags.shop) popupContent += `<br><small>Tür: ${tags.shop}</small>`;
                        else if (tags.amenity) popupContent += `<br><small>Tür: ${tags.amenity}</small>`;
                        if (tags.phone) popupContent += `<br><small>Tel: ${tags.phone}</small>`;
                        if (tags.website) popupContent += `<br><a href="${tags.website.startsWith('http') ? tags.website : 'http://' + tags.website}" target="_blank" rel="noopener noreferrer">Web Sitesi</a>`;
                        popupContent += `</div>`;
                        marker.bindPopup(popupContent);

                        // CSS sınıfı ekle
                        if(marker.getElement()) { // Marker DOM'a eklendikten sonra
                           marker.getElement().classList.add('poi-marker', `${category}-marker`);
                        }


                        poiLayer.addLayer(marker);

                        // Yer adını gösteren özel etiket (divIcon)
                        const labelIcon = L.divIcon({
                            className: `poi-label ${category}-label leaflet-poi-label`, // Genel ve kategoriye özel class + kontrol için class
                            html: `<span>${tags.name}</span>`, // İçeriği span içine alarak daha iyi stil kontrolü
                            iconSize: L.point(120, 20), // Boyut [genişlik, yükseklik]
                            iconAnchor: L.point(60, 25)   // Etiketin ikonun neresine göre konumlanacağı [x, y] - ikonun alt-ortası gibi
                        });

                        const labelMarker = L.marker([lat, lon], {
                            icon: labelIcon,
                            interactive: false, // Etikete tıklanamasın
                            zIndexOffset: -1000, // İkonların altında kalsın
                            opacity: 0.85 // Biraz saydamlık
                        });

                        labelsLayer.addLayer(labelMarker);

                    }
                });

                // Haritaya POI layer'larını ekle
                poiLayer.addTo(map);
                labelsLayer.addTo(map); // Etiketleri de ekle

                // Zoom seviyesine göre etiket görünürlüğünü ayarla
                toggleLabelVisibility();


            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('POI fetch aborted.');
                } else {
                    console.error("POI verilerini çekerken hata oluştu:", error);
                }
                 currentRequestRef.current = null; // Hata durumunda da referansı temizle
            }
        };

         // Etiket görünürlüğünü ayarlayan fonksiyon
         const toggleLabelVisibility = () => {
            const currentZoom = map.getZoom();
            const labelsContainer = labelsLayerRef.current; // Doğrudan layer referansını kullan

            if (labelsContainer) {
                const shouldShow = currentZoom >= 16; // 16 ve üzeri zoomda göster
                 if (shouldShow) {
                     if (!map.hasLayer(labelsContainer)) {
                        map.addLayer(labelsContainer);
                     }
                 } else {
                    if (map.hasLayer(labelsContainer)) {
                        map.removeLayer(labelsContainer);
                    }
                 }
            }

            
        };


        // İlk kez ve harita hareket ettikçe/zoom değiştikçe veriyi çek
        const handleMapChange = () => {
             // Önceki isteği iptal et (varsa)
             if (currentRequestRef.current) {
                currentRequestRef.current.abort();
                console.log("Aborting previous POI request.");
            }
            // Debounce eklenebilir - harita durduktan kısa süre sonra fetch etmek için
             fetchPOIData();
             toggleLabelVisibility(); // Zoom değiştiğinde etiketleri hemen ayarla
        };

        map.on('moveend', handleMapChange);
        map.on('zoomend', toggleLabelVisibility); // Sadece zoom değiştiğinde etiket kontrolü

        // İlk yükleme
        fetchPOIData();
        toggleLabelVisibility();


        // Cleanup function
        return () => {
            console.log("Cleaning up POI Layer listeners and layers.");
             // Önceki isteği iptal et (varsa)
             if (currentRequestRef.current) {
                currentRequestRef.current.abort();
            }
            map.off('moveend', handleMapChange);
            map.off('zoomend', toggleLabelVisibility);
            if (poiLayerRef.current) map.removeLayer(poiLayerRef.current);
            if (labelsLayerRef.current) map.removeLayer(labelsLayerRef.current);
             poiLayerRef.current = null;
             labelsLayerRef.current = null;
        };
    }, [map]); // Sadece map değiştiğinde yeniden kurulmalı

    return null;
}


// --- 3D Kontrolleri Bileşeni ---
function MapControls() {
    const map = useMap(); // Harita instance'ını al

    const getOsMbInstance = () => {
        // Global referansı veya Leaflet map üzerinden erişimi dene
        return window.osmbInstance || (window.OSMBuildings && window.OSMBuildings.instances?.find(inst => inst.map === map));
    };

    // Eğim arttır
    const changeTilt = (delta) => {
        const osmb = getOsMbInstance();
        if (osmb && osmb.getTilt && osmb.setTilt) {
            const currentTilt = osmb.getTilt() || 0;
            osmb.setTilt(Math.max(0, Math.min(90, currentTilt + delta))); // 0-90 arası sınırla
        } else {
            console.warn("OSMBuildings instance or tilt methods not found for tilt control.");
        }
    };

    // Rotasyonu değiştir
    const changeRotation = (delta) => {
        const osmb = getOsMbInstance();
        if (osmb && osmb.getRotation && osmb.setRotation) {
            const currentRotation = osmb.getRotation() || 0;
            // Döngüsel rotasyon için modulo kullanılabilir ama basit +/- yeterli
            osmb.setRotation(currentRotation + delta);
        } else {
             console.warn("OSMBuildings instance or rotation methods not found for rotation control.");
        }
    };

    // Sıfırla
    const resetView = () => {
        const osmb = getOsMbInstance();
        if (osmb) {
            if (osmb.setRotation) osmb.setRotation(0);
            if (osmb.setTilt) osmb.setTilt(0);
        } else {
             console.warn("OSMBuildings instance not found for reset view.");
        }
        // İsteğe bağlı olarak başlangıç konumuna ve zoom'a da dönebilir
        // map.setView(initialCenter, initialZoom);
    };

    // Etiketleri göster/gizle (Bu state POILayer içinde yönetildiği için idealde oradan kontrol edilir)
    // Bu buton dışarıdan POILayer'daki state'i değiştirmeli (Context veya callback prop ile)
    // Şimdilik sadece konsola yazdırabilir veya POILayer'daki visibility fonksiyonunu tetiklemeye çalışabiliriz.
    const toggleLabels = () => {
        console.log("Toggle Labels button clicked - requires state management connection to POILayer");
        // Örnek: Global bir event yayınla veya Context API kullan
        // VEYA POILayer'daki ilgili fonksiyonu (toggleLabelVisibility gibi) global yapıp çağır
         const labelsContainer = document.querySelector('.leaflet-pane .leaflet-layer > .leaflet-marker-pane'); // Veya POILayer'dan referans al
         if (labelsContainer) {
             const isVisible = labelsContainer.style.display !== 'none';
             labelsContainer.style.display = isVisible ? 'none' : ''; // Toggle
         }

         // Daha iyi yöntem: POILayer'ın state'ini güncellemek
         // Örneğin bir context ile: mapContext.toggleLabelsVisibility();
    };

    return (
        <div className="map-controls leaflet-control leaflet-bar"> {/* Leaflet kontrol stili */}
            <button className="map-control-btn" title="Eğimi Artır" onClick={() => changeTilt(10)}>
                <span aria-hidden="true"> Tilt+</span> {/* İkon yerine metin */}
            </button>
            <button className="map-control-btn" title="Eğimi Azalt" onClick={() => changeTilt(-10)}>
                 <span aria-hidden="true">Tilt-</span>
            </button>
            <button className="map-control-btn" title="Sağa Döndür" onClick={() => changeRotation(10)}>
                 <span aria-hidden="true">Rot+</span>
            </button>
            <button className="map-control-btn" title="Sola Döndür" onClick={() => changeRotation(-10)}>
                 <span aria-hidden="true">Rot-</span>
            </button>
            <button className="map-control-btn" title="Görünümü Sıfırla" onClick={resetView}>
                 <span aria-hidden="true">Sıfırla</span>
            </button>
             {/* Etiket kontrolü için POILayer ile iletişim gerekir */}
            {/* <button className="map-control-btn" onClick={toggleLabels}>Etiketler</button> */}
        </div>
    );
}


function ContactPage() {
    // Tema durumunu useState ile yönetelim (örnek amaçlı)
    const [theme, setTheme] = useState('light'); // 'light' veya 'dark'

    // Tema değiştirme fonksiyonu (test için butona bağlanabilir)
    // const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const recipientEmail = 'info@senole.com';
    const companyInfo = {
        name: 'Senole',
        phone: '+90 224 482 47 20',
        fax: '+90 224 482 47 27',
        address: 'SATIŞ ŞUBESİ: NİLÜFER AGORA ÇARŞISI İhsaniye Mahallesi 2. Er Sokak No:8 E Blok 146 Nilüfer/BURSA',
        email: 'info@senole.com',
    };

    const mapPosition = [40.21439, 28.98185]; // Latitude, Longitude
    const mapZoom = 17; // Biraz daha yakınlaştıralım

    // Mevcut temaya göre harita katmanını seç
    const currentTile = tileLayersData[theme] || tileLayersData.light; // Tema yoksa light kullan
    const colorfulTile = tileLayersData.colorful;

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        const subject = encodeURIComponent(values.subject);
        const body = encodeURIComponent(
            `Gönderen Adı: ${values.name}\n` +
            `Gönderen E-posta: ${values.email}\n\n` +
            `Mesaj:\n${values.message}`
        );
        const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

        try {
            // Yeni sekmede açmayı deneyelim, olmazsa aynı sekmede devam etsin
            const mailWindow = window.open(mailtoLink, '_blank');
            if (!mailWindow) {
                 // Pop-up engellenmiş olabilir, aynı sekmede yönlendir
                 window.location.href = mailtoLink;
            }
            alert('E-posta programınız açılacak veya yeni bir sekmede e-posta taslağı oluşturulacak. Lütfen gönderimi tamamlayınız.');
            resetForm();
        }
        catch (error) {
            console.error("Mailto linki açılamadı:", error);
            // Hata durumunda kullanıcıyı bilgilendir
            alert("E-posta programınız otomatik olarak açılamadı. Lütfen manuel olarak e-posta gönderin: " + recipientEmail);
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <MotionContainer
            fluid
            className={`contact-page-container px-0 theme-${theme}`} // Tema sınıfı ekle
            variants={pageVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Tema Değiştirici Buton (Test Amaçlı) */}
            {/*
            <div style={{ position: 'fixed', top: '10px', right: '100px', zIndex: 1100 }}>
                <Button size="sm" onClick={toggleTheme}>Tema Değiştir ({theme})</Button>
            </div>
            */}

            <motion.div className='contact-info-section' variants={sectionVariants}>
                <Container>
                    <Row className='align-items-center text-center text-md-start gy-3'>
                        <MotionCol md={6} lg={2} className='info-item' variants={infoItemVariants}>
                            <BusinessIcon className='info-icon' />
                            <span>{companyInfo.name}</span>
                        </MotionCol>
                        <MotionCol md={6} lg={2} className='info-item' variants={infoItemVariants}>
                            <PhoneIcon className='info-icon' />
                            <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}>{companyInfo.phone}</a>
                        </MotionCol>
                        <MotionCol className='info-item' md={6} lg={2} variants={infoItemVariants}>
                            <FaxIcon className="info-icon" />
                            <span>{companyInfo.fax}</span>
                        </MotionCol>
                        <MotionCol className='info-item' md={6} lg={3} variants={infoItemVariants}>
                            <LocationOnIcon className="info-icon" />
                            <span>{companyInfo.address}</span>
                        </MotionCol>
                        <MotionCol md={6} lg={3} className="info-item mt-md-3 mt-lg-0 justify-content-center justify-content-lg-start" variants={infoItemVariants}>
                            <EmailIcon className="info-icon" />
                            <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
                        </MotionCol>
                    </Row>
                </Container>
            </motion.div>

            <Container className="contact-content-section">
                <MotionRow
                    className="g-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={pageVariants}
                >
                    {/* Sol Taraf: Form */}
                    <MotionCol md={6} variants={contentVariants}>
                        <MotionH3
                            className="mb-4 form-title"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            Bize Ulaşın
                        </MotionH3>
                        <Formik
                            initialValues={{ name: '', email: '', subject: '', message: '' }}
                            validationSchema={ContactSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form noValidate className="contact-form">
                                    <FloatingLabel controlId="floatingName" label="Adınız Soyadınız" className="mb-3">
                                        <Field name="name" type="text" placeholder="Adınız Soyadınız" className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`} />
                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingEmail" label="E-posta Adresiniz" className="mb-3">
                                        <Field name="email" type="email" placeholder="ornek@eposta.com" className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`} />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingSubject" label="Konu" className="mb-3">
                                        <Field name="subject" type="text" placeholder="Konu" className={`form-control ${errors.subject && touched.subject ? 'is-invalid' : ''}`} />
                                        <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingMessage" label="Mesajınız" className="mb-4">
                                        <Field name="message" as="textarea" placeholder="Mesajınızı buraya yazın" style={{ height: '150px' }} className={`form-control ${errors.message && touched.message ? 'is-invalid' : ''}`} />
                                        <ErrorMessage name="message" component="div" className="invalid-feedback" />
                                    </FloatingLabel>

                                    <div className="d-grid">
                                        <MotionButton
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={isSubmitting}
                                            variants={buttonHoverTap}
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                                        </MotionButton>
                                    </div>
                                    <MotionP
                                        className='text-muted small mt-3'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                    >
                                        * Gönder butonuna bastıktan sonra varsayılan e-posta programınız açılacaktır.
                                    </MotionP>
                                </Form>
                            )}
                        </Formik>
                    </MotionCol>

                    {/* Sağ Taraf: 3D Harita */}
                    <MotionCol md={6} className="d-flex flex-column" variants={contentVariants}>
                        <MotionMapContainerDiv
                            className="map-container flex-grow-1" // Yüksekliği doldurması için
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Önemli: MapContainer'a key prop'u ekleyerek tema değiştiğinde yeniden render edilmesini sağlayın */}
                            <MapContainer
                                key={theme} // Tema değişince harita bileşenini yeniden oluştur
                                center={mapPosition}
                                zoom={mapZoom}
                                scrollWheelZoom={true}
                                style={{ height: "100%", width: "100%" }}
                                className={`leaflet-map-${theme}`} // CSS ile tema hedeflemek için
                                // Ekstra MapContainer seçenekleri
                                minZoom={5} // Minimum zoom
                                maxZoom={20} // Maksimum zoom (OSM Buildings ile uyumlu)
                            >
                                <LayersControl position="topright">
                                    {/* Temel Katmanlar */}
                                    <LayersControl.BaseLayer checked={theme === 'light'} name="Açık Tema">
                                        <TileLayer
                                            attribution={tileLayersData.light.attribution}
                                            url={tileLayersData.light.url}
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer checked={theme === 'dark'} name="Koyu Tema">
                                         <TileLayer
                                            attribution={tileLayersData.dark.attribution}
                                            url={tileLayersData.dark.url}
                                        />
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="Renkli Harita">
                                        <TileLayer
                                            attribution={colorfulTile.attribution}
                                            url={colorfulTile.url}
                                        />
                                    </LayersControl.BaseLayer>

                                    {/* Üst Katmanlar (Overlays) */}
                                     <LayersControl.Overlay checked name="Yakındaki Yerler (POI)">
                                        {/* POILayer'ı LayerGroup içine alınca kontrol edilebilir olur */}
                                        <LayerGroup>
                                            <POILayer />
                                        </LayerGroup>
                                    </LayersControl.Overlay>
                                    <LayersControl.Overlay checked name="3B Binalar">
                                        {/* OSMBuildingsLayer'ı LayerGroup içine alınca kontrol edilebilir olur */}
                                        {/* Not: OSMBuildings kendi katmanını yönetir, bu sadece kontrol için */}
                                         <LayerGroup>
                                            {/* OSMBuildingsLayer haritaya doğrudan eklenir, kontrol sadece göstermelik */}
                                        </LayerGroup>
                                    </LayersControl.Overlay>

                                </LayersControl>

                                {/* Şirket Konumu Markeri */}
                                <Marker position={mapPosition}>
                                    <Popup>
                                        <b>{companyInfo.name}</b> <br /> {companyInfo.address.split(':')[1]?.trim()} {/* Adresin sadece mahalle kısmını alalım */}
                                    </Popup>
                                </Marker>

                                {/* 3D Binalar Katmanı */}
                                {/* OSMBuildingsLayer'ı LayersControl DIŞINDA çağırın ki her zaman aktif olsun */}
                                <OSMBuildingsLayer theme={theme} />

                                {/* Harita Kontrolleri */}
                                <MapControls />

                            </MapContainer>
                        </MotionMapContainerDiv>
                    </MotionCol>
                </MotionRow>
            </Container>
        </MotionContainer>
    );
}

export default ContactPage;