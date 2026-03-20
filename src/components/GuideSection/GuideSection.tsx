'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './GuideSection.module.css';

export default function GuideSection() {
  const { t } = useLanguage();

  return (
    <div className={styles.container} id="guide">
      <header className={styles.header}>
        <h2 className={styles.title}>{t.guide.title}</h2>
        <p className={styles.subtitle}>{t.guide.subtitle}</p>
      </header>
      
      <div className={styles.content}>
        
        <details className={styles.accordion} open>
          <summary>{t.guide.acc1Title}</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              {t.guide.acc1List.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.t}</strong>
                  {item.d}
                </li>
              ))}
            </ul>
            <p className={styles.quote}>{t.guide.quote1}</p>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>{t.guide.acc2Title}</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              {t.guide.acc2List.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.t}</strong>
                  {item.d}
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>{t.guide.acc3Title}</summary>
          <div className={styles.accordionContent}>
            <div className={styles.gridList}>
              <div className={styles.gridCol}>
                <h4>{t.guide.baseOptions}</h4>
                <p>{t.guide.baseOptionsDesc}</p>
              </div>
              <div className={styles.gridCol}>
                <h4>{t.guide.addOptions}</h4>
                <p>{t.guide.addOptionsDesc}</p>
              </div>
            </div>
            
            <div className={styles.amenityBox}>
              <strong>{t.guide.freeTitle}</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {t.guide.freeDesc}
              </p>
            </div>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>{t.guide.acc4Title}</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              {t.guide.acc4List.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.t}</strong>
                  <span style={{ whiteSpace: 'pre-wrap' }}>{item.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>{t.guide.acc5Title}</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              {t.guide.acc5List.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.t}</strong>
                  {item.d}
                </li>
              ))}
            </ul>
          </div>
        </details>

      </div>
    </div>
  );
}
