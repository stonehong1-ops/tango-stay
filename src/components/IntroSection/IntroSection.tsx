'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './IntroSection.module.css';

export default function IntroSection() {
  const { t } = useLanguage();

  return (
    <div className={styles.container} id="intro">
      <header className={styles.header}>
        <h2 className={styles.title}>{t.intro.title}</h2>
        <p className={styles.subtitle}>{t.intro.subtitle}</p>
      </header>

      <div className={styles.content}>
        <article className={styles.storyBlock}>
          <p className={styles.leadParagraph}>
            {t.intro.p1}
          </p>

          <div className={styles.solutionList}>
            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>🎁</div>
              <div className={styles.solText}>
                <h4>{t.intro.sol1Title}</h4>
                <p>{t.intro.sol1Text}</p>
              </div>
            </div>

            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>💧</div>
              <div className={styles.solText}>
                <h4>{t.intro.sol2Title}</h4>
                <p>{t.intro.sol2Text}</p>
              </div>
            </div>

            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>✨</div>
              <div className={styles.solText}>
                <h4>{t.intro.sol3Title}</h4>
                <p>{t.intro.sol3Text}</p>
              </div>
            </div>
          </div>
          
          <p className={styles.conclusion}>
            {t.intro.closing}
          </p>
        </article>

        <hr className={styles.divider} />

        <div className={styles.hostProfile}>
          <div className={styles.hostAvatar}>
            <Image 
              src="/images/stonehong.jpg" 
              alt="Host Stone" 
              width={80} 
              height={80} 
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.hostInfo}>
            <h3 className={styles.hostName}>{t.intro.hostName}</h3>
            <p className={styles.hostBio} style={{ whiteSpace: 'pre-wrap' }}>
              {t.intro.hostBio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
