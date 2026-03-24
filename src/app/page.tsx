'use client';

import { useState } from 'react';
import Gallery from '@/components/Gallery/Gallery';
import CalendarSection from '@/components/CalendarSection/CalendarSection';
import LocationSection from '@/components/LocationSection/LocationSection';
import IntroSection from '@/components/IntroSection/IntroSection';
import GuideSection from '@/components/GuideSection/GuideSection';
import ContactSection from '@/components/ContactSection/ContactSection';
import Footer from '@/components/layout/Footer';
import StaySelector from '@/components/layout/StaySelector';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

export default function Home() {
  const { t } = useLanguage();
  const [selectedStayId, setSelectedStayId] = useState('hapjeong');

  // @ts-ignore
  const currentStay = t.stays[selectedStayId] || t.stays.hapjeong;

  return (
    <div className={styles.container}>
      {/* Stay Selection */}
      <StaySelector selectedStayId={selectedStayId} onSelect={setSelectedStayId} />

      {/* 1. Main Photo Gallery (Hero) */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', width: '100%', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
          {currentStay.name}
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)', textAlign: 'center', marginBottom: '2rem', wordBreak: 'keep-all', lineHeight: 1.5 }}>
          {currentStay.hero.subtitle}
        </p>
        <Gallery stayId={selectedStayId} />
      </section>

      {/* 2. Calendar & Booking Entry */}
      <CalendarSection stayId={selectedStayId} />

      {/* 2.5 Location Map */}
      <LocationSection stayId={selectedStayId} />

      {/* 4. Usage Guide (Accordion) - Individual parts included inside */}
      <GuideSection stayId={selectedStayId} />

      {/* 5. Space Intro (Accordion) & Story */}
      <IntroSection />

      {/* 6. Contact Section */}
      <ContactSection />
    </div>
  );
}
