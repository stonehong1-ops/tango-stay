'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

export default function Complete() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>{t.complete.title}</h1>
        <p className={styles.desc}>
          {t.complete.desc}
        </p>
        
        <div className={styles.actions}>
          <Link href="/#guide" className={styles.btnOutline}>
            {t.complete.guideBtn}
          </Link>
          <Link href="/" className={styles.btnPrimary}>
            {t.complete.homeBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
