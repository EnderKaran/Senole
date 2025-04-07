import React, { useEffect, useRef, useState } from 'react';
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

// Import the marker images directly - these will be bundled correctly by build tools like Webpack/Vite
// (Used by Create React App, Next.js, Vite etc.)
import markerIcon2x from '../images/marker-icon-2x.webp'; // Adjust the path as necessary
import markerIcon from '../images/marker-icon.webp';

import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import '../assets/Contact.css'; // CSS dosyamız

// --- Leaflet İkon Düzeltmesi (Vercel/Next.js/Modern Bundler Uyumlu) ---
// This function needs to run once, preferably before any map is rendered.
// We use a global flag to ensure it runs only once.
let leafletIconFixed = false;
const fixLeafletIcon = () => {
  if (leafletIconFixed || typeof window === 'undefined') return; // Run only once on client-side

  // Delete the default icon prototype to avoid potential issues/warnings
  // Only do this if the prototype exists to avoid errors during SSR or if already deleted
  if (L.Icon.Default.prototype._getIconUrl) {
    delete L.Icon.Default.prototype._getIconUrl;
  }

  // Set up the default icon with imported images
  // Use .src if the import object has it (common with Next.js), otherwise use the import directly
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src || markerIcon2x,
    iconUrl: markerIcon.src || markerIcon,
    shadowUrl: markerShadow.src || markerShadow,
    // Explicitly set sizes and anchors for consistency
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  leafletIconFixed = true; // Mark as fixed
  console.log("Leaflet default icon paths fixed.");
};

// Run the fix as soon as the module loads on the client side.
// This is generally safe, but placing it inside a useEffect in the main App
// component or the specific page component is also a valid approach.
if (typeof window !== 'undefined') {
    fixLeafletIcon();
}


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
    // const isMountedRef = useRef(false); // Artık gerekli değil gibi

    useEffect(() => {
        // Çalıştırılmadan önce global scope'ta OSMBuildings'in varlığını kontrol et
        if (typeof window === 'undefined' || !window.OSMBuildings) {
            console.error("OSMBuildings is not loaded! Please add the script to your index.html or _document.js (Next.js).");
            return;
        }
        const OSMBuildings = window.OSMBuildings;


        const initOSMBuildings = () => {
            if (osmBuildingsRef.current) {
                osmBuildingsRef.current.remove();
                osmBuildingsRef.current = null;
            }

            const osmb = new OSMBuildings(map);
            osmBuildingsRef.current = osmb;

            osmb.load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json')
                .then(() => console.log("OSM Buildings data loaded"))
                .catch(error => console.error("Error loading OSM Buildings data:", error));

            const themeSettings = theme === 'dark' ? {
                wallColor: 'rgba(40, 40, 40, 0.8)',
                roofColor: 'rgba(60, 60, 60, 0.8)',
                highlightColor: 'rgba(255, 100, 100, 0.5)',
                shadows: true, minZoom: 15, maxZoom: 20
            } : {
                wallColor: 'rgba(200, 190, 180, 0.9)',
                roofColor: 'rgba(220, 210, 200, 0.9)',
                highlightColor: 'rgba(255, 100, 100, 0.5)',
                shadows: true, minZoom: 15, maxZoom: 20
            };
            osmb.setStyle(themeSettings);

            console.log(`OSMBuildings initialized with ${theme} theme.`);
            window.osmbInstance = osmb; // Global erişim için
        };

        initOSMBuildings();
        // isMountedRef.current = true; // Gerekli değilse kaldırılabilir

        return () => {
            if (osmBuildingsRef.current) {
                console.log("Removing OSMBuildings instance.");
                osmBuildingsRef.current.remove(); // Use remove() method
                osmBuildingsRef.current = null;
            }
            // Check if window.osmbInstance belongs to this component before deleting
            if (window.osmbInstance === osmBuildingsRef.current) {
               delete window.osmbInstance;
            }
        };
    }, [map, theme]);

    return null;
}

// --- POI (Points of Interest) Layer ---
function POILayer() {
    const map = useMap();
    const poiLayerRef = useRef(null);
    const labelsLayerRef = useRef(null);
    const currentRequestRef = useRef(null);
    const debounceTimeoutRef = useRef(null); // Debounce için timeout referansı

    // Etiket görünürlüğünü ayarlayan fonksiyon (bağımsız hale getirildi)
    const toggleLabelVisibility = () => {
      // Ensure map and labelsLayerRef are available
      if (!map || !labelsLayerRef.current) return;

        const currentZoom = map.getZoom();
        const labelsContainer = labelsLayerRef.current;

        const shouldShow = currentZoom >= 17; // Gösterim zoom seviyesi (16 veya 17 iyi bir başlangıç)
        try {
             if (shouldShow) {
                 if (!map.hasLayer(labelsContainer)) {
                    map.addLayer(labelsContainer);
                 }
             } else {
                if (map.hasLayer(labelsContainer)) {
                    map.removeLayer(labelsContainer);
                }
             }
        } catch (error) {
            // map.hasLayer veya add/removeLayer bazen layer henüz tam hazır değilse hata verebilir
            console.warn("Error toggling label visibility:", error);
        }
    };

    useEffect(() => {
        const fetchPOIData = async () => {
            if (currentRequestRef.current) {
                console.log("POI fetch already in progress, aborting previous.");
                currentRequestRef.current.abort(); // Önceki isteği iptal et
            }

            const controller = new AbortController();
            currentRequestRef.current = controller;

            try {
                const mapBounds = map.getBounds();
                const south = mapBounds.getSouth();
                const west = mapBounds.getWest();
                const north = mapBounds.getNorth();
                const east = mapBounds.getEast();

                if (map.getZoom() < 14) {
                    console.log("Zoom level too low, skipping POI fetch and clearing layers.");
                    if (poiLayerRef.current && map.hasLayer(poiLayerRef.current)) map.removeLayer(poiLayerRef.current);
                    if (labelsLayerRef.current && map.hasLayer(labelsLayerRef.current)) map.removeLayer(labelsLayerRef.current);
                    poiLayerRef.current = null;
                    labelsLayerRef.current = null;
                    currentRequestRef.current = null;
                    return;
                }

                // Sorguyu daha yönetilebilir hale getirelim
                const poiTypes = [
                    'node["shop"]', 'way["shop"]',
                    'node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]', 'way["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"]',
                    'node["amenity"~"^(bank|pharmacy|atm|marketplace|cinema|theatre)$"]', 'way["amenity"~"^(bank|pharmacy|atm|marketplace|cinema|theatre)$"]'
                ];
                const boundsStr = `(${south},${west},${north},${east});`;
                const query = `
                    [out:json][timeout:25];
                    (
                       ${poiTypes.map(type => `${type}${boundsStr}`).join('\n')}
                    );
                    out center;
                `;

                console.log("Fetching POI data for bounds:", mapBounds);
                const response = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    body: query,
                    signal: controller.signal
                });

                currentRequestRef.current = null; // İstek bitti

                if (!response.ok) {
                    // Retry logic could be added here for specific status codes (e.g., 429 Too Many Requests)
                    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("POI data received:", data.elements.length, "elements");

                // Önceki katmanları haritadan kaldır
                 if (poiLayerRef.current && map.hasLayer(poiLayerRef.current)) {
                    map.removeLayer(poiLayerRef.current);
                 }
                 if (labelsLayerRef.current && map.hasLayer(labelsLayerRef.current)) {
                    map.removeLayer(labelsLayerRef.current);
                 }

                const newPoiLayer = L.layerGroup();
                const newLabelsLayer = L.layerGroup();
                poiLayerRef.current = newPoiLayer; // Referansları güncelle
                labelsLayerRef.current = newLabelsLayer;

                data.elements.forEach(element => {
                    const lat = element.lat ?? element.center?.lat;
                    const lon = element.lon ?? element.center?.lon;
                    const tags = element.tags;

                    if (tags && tags.name && lat && lon) {
                        let icon;
                        let category = 'other';

                        if (tags.shop) { icon = shopIcon; category = 'shop'; }
                        else if (tags.amenity && ['restaurant', 'cafe', 'fast_food', 'bar', 'pub'].includes(tags.amenity)) { icon = restaurantIcon; category = 'restaurant'; }
                        else if (tags.amenity) { icon = amenityIcon; category = 'amenity'; }
                        else { return; } // Skip if no suitable icon/category

                        const marker = L.marker([lat, lon], { icon: icon, opacity: 0.9, riseOnHover: true });

                        let popupContent = `<div class="poi-popup"><strong>${tags.name}</strong>`;
                        const amenityType = tags.shop || tags.amenity;
                        if (amenityType) popupContent += `<br><small>Tür: ${amenityType}</small>`;
                        if (tags.phone) popupContent += `<br><small>Tel: ${tags.phone}</small>`;
                        if (tags.website) popupContent += `<br><a href="${tags.website.startsWith('http') ? tags.website : 'http://' + tags.website}" target="_blank" rel="noopener noreferrer">Web Sitesi</a>`;
                        popupContent += `</div>`;
                        marker.bindPopup(popupContent);

                        newPoiLayer.addLayer(marker);

                        // Create label only if zoom level allows it initially or if needed later
                        const labelIcon = L.divIcon({
                            className: `poi-label ${category}-label leaflet-poi-label`,
                            html: `<span>${tags.name}</span>`,
                            iconSize: L.point(120, 20),
                            iconAnchor: L.point(60, 25) // Anchor below the center
                        });

                        const labelMarker = L.marker([lat, lon], {
                            icon: labelIcon,
                            interactive: false,
                            zIndexOffset: -1000, // Keep labels below markers
                            opacity: 0.85
                        });
                        newLabelsLayer.addLayer(labelMarker);
                    }
                });

                // Add POI layer immediately
                 newPoiLayer.addTo(map);
                // Add labels layer based on current zoom visibility
                toggleLabelVisibility();

            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('POI fetch aborted.');
                } else {
                    console.error("Error fetching or processing POI data:", error);
                }
                currentRequestRef.current = null;
            }
        };

        // Debounce map movement to avoid excessive API calls
        const debouncedFetchPOIData = () => {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = setTimeout(() => {
                fetchPOIData();
            }, 750); // Wait 750ms after map stops moving (adjust as needed)
        };

        const handleMapMoveEnd = () => {
            debouncedFetchPOIData(); // Fetch data after movement stops
            toggleLabelVisibility(); // Also check label visibility on move end
        };

         const handleMapZoomEnd = () => {
            // Fetch data immediately on zoom end if needed, or rely on moveend
             fetchPOIData(); // Fetch new data for potentially different area/zoom level
             toggleLabelVisibility(); // Adjust label visibility based on new zoom
         };

        map.on('moveend', handleMapMoveEnd);
        map.on('zoomend', handleMapZoomEnd);

        // Initial fetch
        fetchPOIData();
        // toggleLabelVisibility(); // Called within fetchPOIData after layers are created

        // Cleanup function
        return () => {
            console.log("Cleaning up POI Layer listeners and layers.");
            clearTimeout(debounceTimeoutRef.current); // Clear any pending debounce timeout
            if (currentRequestRef.current) {
                currentRequestRef.current.abort(); // Abort ongoing request
            }
            map.off('moveend', handleMapMoveEnd);
            map.off('zoomend', handleMapZoomEnd);

            // Safely remove layers if they exist and are on the map
            if (poiLayerRef.current && map.hasLayer(poiLayerRef.current)) {
                 try { map.removeLayer(poiLayerRef.current); } catch (e) { console.warn("Error removing POI layer:", e)}
            }
             if (labelsLayerRef.current && map.hasLayer(labelsLayerRef.current)) {
                 try { map.removeLayer(labelsLayerRef.current); } catch (e) { console.warn("Error removing labels layer:", e)}
            }
            poiLayerRef.current = null; // Clear refs
            labelsLayerRef.current = null;
        };
    }, [map]); // Dependency: map instance

    return null; // This component doesn't render anything itself
}


// --- 3D Kontrolleri Bileşeni ---
function MapControls() {
  const map = useMap(); // Harita instance'ını al

  const getOsMbInstance = () => {
    // Try global reference first, then check Leaflet map instance registry
    return window.osmbInstance || (window.OSMBuildings && window.OSMBuildings.instances?.find(inst => inst.map === map));
  };

  // Change tilt
  const changeTilt = (delta) => {
    const osmb = getOsMbInstance();
    if (osmb?.setTilt && osmb?.getTilt) { // Check if methods exist
      const currentTilt = osmb.getTilt() || 0;
      osmb.setTilt(Math.max(0, Math.min(90, currentTilt + delta))); // Clamp between 0-90
    } else {
      console.warn("OSMBuildings instance or tilt methods not available.");
    }
  };

  // Change rotation
  const changeRotation = (delta) => {
    const osmb = getOsMbInstance();
    if (osmb?.setRotation && osmb?.getRotation) { // Check if methods exist
      const currentRotation = osmb.getRotation() || 0;
      osmb.setRotation(currentRotation + delta);
    } else {
      console.warn("OSMBuildings instance or rotation methods not available.");
    }
  };

  // Reset view
  const resetView = () => {
    const osmb = getOsMbInstance();
    if (osmb) {
      if (osmb.setRotation) osmb.setRotation(0);
      if (osmb.setTilt) osmb.setTilt(0);
    } else {
      console.warn("OSMBuildings instance not available for reset view.");
    }
    // Optional: Reset map center and zoom as well
    // map.setView(initialCenter, initialZoom);
  };

  // Note: Toggling labels from here is complex as the state resides in POILayer.
  // A better approach would use Context API or state lifting.
  // This basic implementation tries to find the layer pane, which is brittle.
  const toggleLabels = () => {
    console.warn("Toggle Labels button is illustrative. Requires connection to POILayer state.");
    const labelsPane = map.getPane('markerPane'); // Labels are often in markerPane
    if (labelsPane) {
        // This targets ALL markers/icons in the pane, not just POI labels
        // A more specific selector or direct layer control is needed.
        const poiLabels = labelsPane.querySelectorAll('.leaflet-poi-label'); // Use the specific class
        if (poiLabels.length > 0) {
            const isVisible = poiLabels[0].style.display !== 'none';
            poiLabels.forEach(label => {
                label.style.display = isVisible ? 'none' : '';
            });
            console.log(`Toggled POI labels ${isVisible ? 'off' : 'on'}`);
        } else {
             console.log("No POI labels found to toggle.");
        }

    } else {
         console.warn("Could not find marker pane to toggle labels.");
    }
  };

  return (
    <div className="map-controls leaflet-control leaflet-bar">
      <button className="map-control-btn" title="Eğimi Artır" onClick={() => changeTilt(10)}>
        <span aria-hidden="true">Tilt+</span> {/* Use text or icons */}
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
       {/* <button className="map-control-btn" title="Etiketleri Aç/Kapa" onClick={toggleLabels}>
        <span aria-hidden="true">Etiket</span>
       </button> */}
    </div>
  );
}


function ContactPage() {
  // Tema durumunu useState ile yönetelim
  const [theme, setTheme] = useState('light'); // 'light' veya 'dark'

  // Run the Leaflet icon fix only on client side, once
  // fixLeafletIcon(); // Can run here or at module level

  const recipientEmail = 'info@senole.com';
  const companyInfo = {
    name: 'Senole',
    phone: '+90 224 482 47 20',
    fax: '+90 224 482 47 27',
    address: 'SATIŞ ŞUBESİ: NİLÜFER AGORA ÇARŞISI İhsaniye Mahallesi 2. Er Sokak No:8 E Blok 146 Nilüfer/BURSA',
    email: 'info@senole.com',
  };

  const mapPosition = [40.21439, 28.98185]; // Latitude, Longitude
  const mapZoom = 17;

  // Mevcut temaya göre harita katmanını seç
  // const currentTile = tileLayersData[theme] || tileLayersData.light; // Not directly used below, theme passed to map
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
      // Try opening in a new tab/window first
      const mailWindow = window.open(mailtoLink, '_blank');
      if (!mailWindow || mailWindow.closed || typeof mailWindow.closed === 'undefined') {
         // If blocked or failed, fallback to same window (might navigate away)
         window.location.href = mailtoLink;
      }
      alert('E-posta programınız açılacak veya yeni bir sekmede e-posta taslağı oluşturulacak. Lütfen gönderimi tamamlayınız.');
      resetForm();
    }
    catch (error) {
      console.error("Mailto link could not be opened:", error);
      // Inform user about manual sending
      alert("E-posta programınız otomatik olarak açılamadı. Lütfen manuel olarak e-posta gönderin: " + recipientEmail);
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <MotionContainer
      fluid
      className={`contact-page-container px-0 theme-${theme}`} // Apply theme class for global styling
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
       {/* Optional Theme Toggle Button for testing */}
       {/* <Button
           style={{ position: 'fixed', top: '10px', right: '100px', zIndex: 1100 }}
           size="sm"
           onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
       >
           Tema: {theme}
       </Button> */}

      <motion.div className='contact-info-section' variants={sectionVariants}>
        <Container>
          <Row className='align-items-center text-center text-md-start gy-3'>
            {/* Info Items */}
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
          className="g-5" // Gutters
          initial="hidden"
          whileInView="visible" // Animate when scrolled into view
          viewport={{ once: true, amount: 0.1 }} // Trigger animation once
          variants={pageVariants} // Stagger children animation
        >
          {/* Left Side: Form */}
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
              {/* Formik render prop */}
              {({ isSubmitting, errors, touched }) => (
                <Form noValidate className="contact-form">
                   {/* Email Field (Completed) */}
                   <FloatingLabel controlId="floatingEmail" label="E-posta Adresiniz" className="mb-3">
                    <Field
                       name="email"
                       type="email"
                       placeholder="ornek@eposta.com" // Placeholder for accessibility
                       className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                   </FloatingLabel>

                   {/* Subject Field */}
                   <FloatingLabel controlId="floatingSubject" label="Konu" className="mb-3">
                    <Field
                       name="subject"
                       type="text"
                       placeholder="Konu"
                       className={`form-control ${errors.subject && touched.subject ? 'is-invalid' : ''}`}
                     />
                    <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                   </FloatingLabel>

                   {/* Message Field */}
                   <FloatingLabel controlId="floatingMessage" label="Mesajınız" className="mb-4">
                     <Field
                       name="message"
                       as="textarea" // Use textarea
                       placeholder="Mesajınızı buraya yazın"
                       style={{ height: '150px' }} // Custom height
                       className={`form-control ${errors.message && touched.message ? 'is-invalid' : ''}`}
                     />
                     <ErrorMessage name="message" component="div" className="invalid-feedback" />
                   </FloatingLabel>

                   {/* Submit Button */}
                   <div className="d-grid"> {/* Makes button full width */}
                     <MotionButton
                       type="submit"
                       variant="primary" // Bootstrap button style
                       size="lg"
                       disabled={isSubmitting} // Disable while submitting
                       variants={buttonHoverTap}
                       whileHover="hover"
                       whileTap="tap"
                     >
                       {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                     </MotionButton>
                   </div>

                   {/* Information Text */}
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
          </MotionCol> {/* End Form Col */}

          {/* Right Side: 3D Map */}
          <MotionCol md={6} className="d-flex flex-column" variants={contentVariants}>
            <MotionMapContainerDiv
              className="map-container flex-grow-1" // Ensure it fills height
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Important: MapContainer needs a key that changes with theme for OSMBuildings to re-initialize correctly */}
              <MapContainer
                key={theme} // Force re-render on theme change
                center={mapPosition}
                zoom={mapZoom}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className={`leaflet-map-${theme}`} // For theme-specific CSS rules
                minZoom={5}
                maxZoom={20} // Ensure compatible with OSM Buildings zoom
              >
                <LayersControl position="topright">
                  {/* Base Layers (Themes) */}
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

                  {/* Overlays */}
                  <LayersControl.Overlay checked name="Yakındaki Yerler (POI)">
                     {/* POILayer manages itself, wrapping in LayerGroup provides control */}
                     <LayerGroup>
                       <POILayer />
                     </LayerGroup>
                  </LayersControl.Overlay>
                  <LayersControl.Overlay checked name="3B Binalar">
                     {/* OSMBuildingsLayer also manages itself. This control is mainly for UI consistency. */}
                     <LayerGroup>
                        {/* The actual OSMBuildingsLayer is rendered directly below */}
                     </LayerGroup>
                  </LayersControl.Overlay>
                </LayersControl>

                {/* Company Location Marker - Uses the fixed default icon */}
                <Marker position={mapPosition}>
                  <Popup>
                    <b>{companyInfo.name}</b> <br /> {companyInfo.address.split(':')[1]?.trim()}
                  </Popup>
                </Marker>

                {/* 3D Buildings Layer */}
                {/* Render OSMBuildingsLayer directly inside MapContainer */}
                <OSMBuildingsLayer theme={theme} />

                {/* Map Controls (Tilt, Rotate, Reset) */}
                <MapControls />

              </MapContainer>
            </MotionMapContainerDiv>
          </MotionCol> {/* End Map Col */}
        </MotionRow> {/* End Content Row */}
      </Container> {/* End Content Container */}
    </MotionContainer> /* End Page Container */
  );
}

export default ContactPage;