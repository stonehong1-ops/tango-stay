'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <div className={styles.container} id="contact">
      <header className={styles.header}>
        <h2 className={styles.title}>{t.contact.title}</h2>
        <p className={styles.desc}>{t.contact.desc}</p>
      </header>

      <div className={styles.contactGrid}>
        <a href="tel:010-7209-2468" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
          <div className={styles.icon}>📞</div>
          <h3>{t.contact.call}</h3>
          <p>{t.contact.callDesc}</p>
        </a>

        <a href="sms:010-7209-2468" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
          <div className={styles.icon}>💬</div>
          <h3>{t.contact.sms}</h3>
          <p>{t.contact.smsDesc}</p>
        </a>

        <a href="https://open.kakao.com/o/sNq0Irmi" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.kakao}`}>
          <div className={styles.icon}>💛</div>
          <h3>{t.contact.kakao}</h3>
          <p>{t.contact.kakaoDesc}</p>
        </a>

        <a href="https://wa.me/821072092468" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.whatsapp}`}>
          <div className={styles.icon}>🟩</div>
          <h3>{t.contact.whatsapp}</h3>
          <p>{t.contact.whatsappDesc}</p>
        </a>

        <a href="https://m.me/StoneHong1" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.messenger}`}>
          <div className={styles.icon}>📘</div>
          <h3>{t.contact.fb}</h3>
          <p>{t.contact.fbDesc}</p>
        </a>
      </div>
    </div>
  );
}
