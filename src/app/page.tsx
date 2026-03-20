import Gallery from '@/components/Gallery/Gallery';
import CalendarSection from '@/components/CalendarSection/CalendarSection';
import LocationSection from '@/components/LocationSection/LocationSection';
import IntroSection from '@/components/IntroSection/IntroSection';
import GuideSection from '@/components/GuideSection/GuideSection';
import ContactSection from '@/components/ContactSection/ContactSection';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* 1. Main Photo Gallery (Hero) */}
      <section style={{ maxWidth: '1200px', margin: '2rem auto 0', width: '100%', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--foreground)' }}>TangoStay</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)', textAlign: 'center', marginBottom: '2rem', wordBreak: 'keep-all', lineHeight: 1.5 }}>
          합정역 1분 거리, 도보로 만나는 한강공원, 조용하고 편안한 나만의 숙소
        </p>
        <Gallery />
      </section>

      {/* 2. Calendar & Booking Entry */}
      <CalendarSection />

      {/* 2.5 Location Map */}
      <LocationSection />

      {/* 3. Space Intro (Accordion) */}
      <IntroSection />

      {/* 4. Usage Guide (Accordion) */}
      <GuideSection />

      {/* 5. Direct Contact Links */}
      <ContactSection />

      {/* 6. Footer (Terms & Privacy) */}
      <Footer />
    </div>
  );
}
