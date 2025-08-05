# Directus CMS Integration Guide für CarBot

Diese Anleitung erklärt die vollständige Integration von Directus als Headless CMS für das CarBot-System.

## 🚀 Übersicht

Das CarBot-System wurde erfolgreich mit Directus als Headless CMS erweitert, um dynamische Inhalte für deutsche Autowerkstätten zu verwalten. Die Integration umfasst:

- **Content Management**: Services, Blog-Artikel, FAQs, Testimonials
- **Multi-Language Support**: Deutsch, Englisch, Türkisch, Polnisch
- **GDPR-Compliance**: Datenschutzkonforme Formulare und Datenverarbeitung
- **SEO-Optimierung**: Strukturierte Daten und Meta-Tags
- **Performance**: Caching und Bildoptimierung

## 📁 Projektstruktur

```
CarBot/
├── lib/
│   ├── directus.js              # Directus API Client
│   ├── i18n-cms.js             # Erweiterte Internationalisierung
│   └── seo-cms.js              # SEO Utilities
├── components/cms/
│   ├── ServiceCard.jsx         # Service-Komponenten
│   ├── BlogPost.jsx           # Blog-Komponenten
│   ├── FAQ.jsx                # FAQ-Komponenten
│   ├── Testimonial.jsx        # Bewertungs-Komponenten
│   ├── HeroSection.jsx        # Hero-Sektionen
│   ├── ContentBlock.jsx       # Flexible Content-Blöcke
│   ├── ImageGallery.jsx       # Bildgalerien
│   └── ContactInfo.jsx        # Kontakt-Komponenten
├── app/
│   ├── services/
│   │   ├── page.jsx           # Services Übersicht
│   │   └── [slug]/page.jsx    # Einzelner Service
│   └── blog/
│       ├── page.jsx           # Blog Übersicht
│       └── [slug]/page.jsx    # Einzelner Artikel
├── directus/
│   └── schema.json            # Directus Content-Modelle
└── types/
    └── directus.ts            # TypeScript Definitionen
```

## 🛠 Installation & Setup

### 1. Directus SDK installieren

```bash
npm install @directus/sdk
```

### 2. Umgebungsvariablen konfigurieren

```env
# Directus Configuration
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_directus_admin_token
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055

# Cache Configuration
CACHE_TTL=300
```

### 3. Directus Server einrichten

```bash
# Directus installieren
npm install directus

# Projekt initialisieren
npx directus init

# Server starten
npx directus start
```

### 4. Content-Modelle importieren

Importieren Sie das Schema aus `directus/schema.json` in Ihre Directus-Installation.

## 📝 Content-Modelle

### Workshop Services
- **Felder**: title, slug, category, description, price_from, price_to, duration, image, gallery
- **Kategorien**: TÜV, Inspektion, Reparaturen, Wartung, Klimaservice, Reifenservice
- **Mehrsprachigkeit**: Vollständige Übersetzungsunterstützung

### Blog Posts
- **Felder**: title, slug, excerpt, content, featured_image, author, category, tags
- **Kategorien**: Neuigkeiten, Tipps, Vorschriften, Technik, Saisonales
- **Features**: Rich-Text Editor, Bildergalerien, SEO-Metadaten

### FAQs
- **Felder**: question, answer, category, sort
- **Kategorien**: Allgemein, Services, Preise, Termine, TÜV, Garantie
- **Features**: Suchfunktion, Kategorisierung

### Testimonials
- **Felder**: customer_name, customer_location, rating, review_text, vehicle_info
- **Features**: 5-Sterne-Bewertung, Fahrzeuginformationen

### Landing Pages
- **Felder**: title, hero_title, hero_subtitle, hero_image, content_blocks
- **Features**: Flexible Content-Blöcke, CTA-Buttons

## 🎨 React-Komponenten

### ServiceCard
```jsx
import { ServiceCard, ServiceGrid } from '../components/cms/ServiceCard';

// Einzelne Service-Karte
<ServiceCard service={service} language="de" />

// Service-Grid
<ServiceGrid services={services} language="de" />
```

### BlogPost
```jsx
import { BlogPost, BlogGrid } from '../components/cms/BlogPost';

// Einzelner Artikel
<BlogPost post={post} variant="full" language="de" />

// Artikel-Grid
<BlogGrid posts={posts} language="de" />
```

### FAQ
```jsx
import { FAQ, FAQSection } from '../components/cms/FAQ';

// FAQ mit Suche
<FAQSection faqs={faqs} language="de" />
```

### Testimonial
```jsx
import { TestimonialGrid, TestimonialSlider } from '../components/cms/Testimonial';

// Bewertungs-Grid
<TestimonialGrid testimonials={testimonials} language="de" />

// Bewertungs-Slider
<TestimonialSlider testimonials={testimonials} language="de" />
```

## 🌐 Mehrsprachigkeit

### Sprachunterstützung
- **Deutsch (de)**: Primärsprache
- **Englisch (en)**: Internationale Kunden
- **Türkisch (tr)**: Türkische Community
- **Polnisch (pl)**: Polnische Community

### Übersetzungen abrufen
```javascript
import { getCMSTranslation } from '../lib/i18n-cms';

const label = getCMSTranslation('de', 'cms.services_title');
```

## 🔍 SEO-Optimierung

### Meta-Tags generieren
```javascript
import { generateSEOMetadata } from '../lib/seo-cms';

const metadata = generateSEOMetadata({
  title: 'KFZ Service',
  description: 'Professioneller KFZ Service',
  image: service.image,
  language: 'de'
});
```

### Strukturierte Daten
```javascript
import { generateServiceStructuredData } from '../lib/seo-cms';

const structuredData = generateServiceStructuredData(service, 'de', contactInfo);
```

## 📊 API-Nutzung

### Services abrufen
```javascript
import { getWorkshopServices, getWorkshopService } from '../lib/directus';

// Alle Services
const services = await getWorkshopServices('de');

// Einzelner Service
const service = await getWorkshopService('tuv-hu', 'de');
```

### Blog-Artikel abrufen
```javascript
import { getBlogPosts, getBlogPost } from '../lib/directus';

// Alle Artikel
const posts = await getBlogPosts('de', 10);

// Einzelner Artikel
const post = await getBlogPost('wartungstipps-winter', 'de');
```

## 🎯 GDPR-Compliance

### Kontaktformular
- Explizite Einwilligung zur Datenverarbeitung
- Optionale Newsletter-Anmeldung
- Links zu Datenschutzerklärung und AGB
- Sichere Datenübertragung

### Datenschutz-Features
```jsx
<ContactForm 
  language="de"
  privacyPolicyUrl="/legal/datenschutz"
  termsUrl="/legal/agb"
/>
```

## 🚀 Performance-Optimierung

### Caching
- **In-Memory Cache**: 5 Minuten TTL
- **Image Optimization**: Automatische Größenanpassung
- **Static Generation**: Für Services und Artikel

### Bildoptimierung
```javascript
import { getOptimizedImageUrl } from '../lib/directus';

const imageUrl = getOptimizedImageUrl(imageId, 800, 600, 80);
```

## 🔧 Entwicklung

### Neue Content-Typen hinzufügen

1. **Directus-Schema erweitern**
   - Neue Collection erstellen
   - Felder definieren
   - Beziehungen konfigurieren

2. **TypeScript-Typen definieren**
   ```typescript
   // types/directus.ts
   export interface NewContentType {
     id: number;
     title: string;
     // weitere Felder...
   }
   ```

3. **API-Funktionen erstellen**
   ```javascript
   // lib/directus.js
   export async function getNewContent(language = 'de') {
     return fetchWithCache('new_content', {
       filter: { status: { _eq: 'published' } }
     });
   }
   ```

4. **React-Komponenten entwickeln**
   ```jsx
   // components/cms/NewContent.jsx
   export default function NewContent({ content }) {
     // Komponenten-Logik
   }
   ```

### Testing

```bash
# Komponenten testen
npm test

# E2E Tests
npm run test:e2e
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals
- Image Loading Performance
- API Response Times

### Content Analytics
- Beliebte Services
- Blog-Artikel Performance
- FAQ-Nutzung

## 🔒 Sicherheit

### API-Sicherheit
- Token-basierte Authentifizierung
- Rate Limiting
- Input Validation

### GDPR-Compliance
- Datenminimierung
- Einwilligungsmanagement
- Recht auf Löschung

## 🚀 Deployment

### Vercel Deployment
```bash
# Build erstellen
npm run build

# Deployment
vercel deploy
```

### Umgebungsvariablen
```env
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_TOKEN=your_production_token
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
```

## 📚 Dokumentation

### API-Dokumentation
- Alle API-Endpunkte sind in `lib/directus.js` dokumentiert
- TypeScript-Typen in `types/directus.ts`

### Komponenten-Dokumentation
- Jede Komponente hat ausführliche JSDoc-Kommentare
- Beispiele für alle Verwendungszwecke

## 🎯 Best Practices

### Content-Management
1. **Strukturierte Inhalte**: Verwenden Sie die definierten Content-Modelle
2. **SEO-Optimierung**: Füllen Sie immer Meta-Titel und -Beschreibungen aus
3. **Bildoptimierung**: Verwenden Sie WebP-Format und optimale Größen
4. **Mehrsprachigkeit**: Übersetzen Sie alle Inhalte für alle unterstützten Sprachen

### Entwicklung
1. **Komponenten-Struktur**: Verwenden Sie die CMS-Komponenten als Basis
2. **Error Handling**: Implementieren Sie Fallback-Mechanismen
3. **Performance**: Nutzen Sie das integrierte Caching
4. **Accessibility**: Befolgen Sie WCAG-Richtlinien

## 🆘 Troubleshooting

### Häufige Probleme

**Directus-Verbindung fehlgeschlagen**
```bash
# Verbindung testen
curl -H "Authorization: Bearer YOUR_TOKEN" YOUR_DIRECTUS_URL/items/workshop_services
```

**Bilder werden nicht geladen**
- Überprüfen Sie die CORS-Einstellungen in Directus
- Validieren Sie die Bild-URLs

**Übersetzungen fehlen**
- Überprüfen Sie die Sprachkonfiguration
- Validieren Sie die Übersetzungsfelder

## 📞 Support

Bei Fragen zur Directus-Integration:

1. Überprüfen Sie die Dokumentation
2. Schauen Sie in die Konsole für Fehlermeldungen
3. Testen Sie die API-Endpunkte direkt
4. Kontaktieren Sie das Entwicklungsteam

## 🔄 Updates

### Regelmäßige Wartung
- Directus SDK aktualisieren
- Sicherheits-Patches einspielen
- Performance-Optimierungen

### Migration
- Backup vor Updates
- Staging-Umgebung testen
- Schrittweise Bereitstellung

---

**Das CarBot Directus CMS System ist jetzt vollständig integriert und einsatzbereit für deutsche Autowerkstätten!** 🚗✨