'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './IntroSection.module.css';

export default function IntroSection() {
  const { t } = useLanguage();
  const story = t.common.story;
  const contact = t.common.contact;

  return (
    <div className={styles.container} id="intro">
      <header className={styles.header}>
        <h2 className={styles.title}>{story.title}</h2>
        <p className={styles.subtitle}>{story.subtitle}</p>
      </header>

      <div className={styles.content}>
        <article className={styles.storyBlock}>
          <p className={styles.leadParagraph}>
            {story.p1}
          </p>

          <div className={styles.solutionList}>
            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>🎁</div>
              <div className={styles.solText}>
                <h4>{story.sol1Title}</h4>
                <p>{story.sol1Text}</p>
              </div>
            </div>

            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>💧</div>
              <div className={styles.solText}>
                <h4>{story.sol2Title}</h4>
                <p>{story.sol2Text}</p>
              </div>
            </div>

            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>✨</div>
              <div className={styles.solText}>
                <h4>{story.sol3Title}</h4>
                <p>{story.sol3Text}</p>
              </div>
            </div>
          </div>
          
          <p className={styles.conclusion}>
            {story.closing}
          </p>
        </article>

        <hr className={styles.divider} />

        <div className={styles.hostProfile}>
          <div className={styles.hostAvatar}>
            <Image 
              src="/images/stonehong.jpg" 
              alt="Host Stone" 
              width={100} 
              height={100} 
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.hostInfo}>
            <h3 className={styles.hostName}>{story.hostName}</h3>
            <p className={styles.hostBio} style={{ whiteSpace: 'pre-wrap' }}>
              {story.hostBio}
            </p>
          </div>
        </div>

        <div className={styles.contactSection} id="contact">
          <div className={styles.contactGrid}>
            <a href="tel:010-7209-2468" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.icon}>📞</div>
              <h3>{contact.call}</h3>
              <p>{contact.callDesc}</p>
            </a>

            <a href="sms:010-7209-2468" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.icon}>💬</div>
              <h3>{contact.sms}</h3>
              <p>{contact.smsDesc}</p>
            </a>

            <a href="https://open.kakao.com/o/sNq0Irmi" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.kakao}`}>
              <div className={styles.icon}>💛</div>
              <h3>{contact.kakao}</h3>
              <p>{contact.kakaoDesc}</p>
            </a>

            <a href="https://wa.me/821072092468" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.whatsapp}`}>
              <div className={styles.icon}>🟩</div>
              <h3>{contact.whatsapp}</h3>
              <p>{contact.whatsappDesc}</p>
            </a>

            <a href="https://m.me/StoneHong1" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.messenger}`}>
              <div className={styles.icon}>📘</div>
              <h3>{contact.fb}</h3>
              <p>{contact.fbDesc}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
