'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './LocationSection.module.css';

export default function LocationSection() {
  const { t } = useLanguage();

  return (
    <section className={styles.container} id="location">
      <h2 className={styles.title}>{t.location.title}</h2>
      <p className={styles.address}>
        <strong>{t.location.addressLabel}</strong> {t.location.address}<br/>
        <strong>{t.location.bldgLabel}</strong> {t.location.bldg}
      </p>

      <div className={styles.mapWrapper}>
        <iframe
          src="https://maps.google.com/maps?q=서울%20마포구%20양화로%2013&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TangoStay Google Maps"
        />
      </div>

      <div className={styles.buttonGroup}>
        <a 
          href="https://map.naver.com/p/search/서울%20마포구%20양화로%2013" 
          rel="noopener noreferrer"
          className={`${styles.mapBtn} ${styles.naver}`}
        >
          {t.location.naver}
        </a>
        <a 
          href="https://map.kakao.com/link/search/서울 마포구 양화로 13" 
          rel="noopener noreferrer"
          className={`${styles.mapBtn} ${styles.kakao}`}
        >
          {t.location.kakao}
        </a>
      </div>
    </section>
  );
}
