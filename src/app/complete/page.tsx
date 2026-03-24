'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

function CompleteContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';
  const total = searchParams.get('total') || '';
  const msg = searchParams.get('msg') || '';
  const stayId = searchParams.get('stayId') || 'hapjeong';

  const [isIOS, setIsIOS] = useState(false);

  // @ts-ignore
  const stayName = t.stays[stayId]?.name || '탱고스테이';

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // Consolidated SMS (Guest Number as recipient)
  const fullBody = `[${stayName} 예약확인]\n예약자: ${name}님\n날짜: ${checkIn} ~ ${checkOut}\n인원: ${guests}명\n금액: ${parseInt(total || '0').toLocaleString()}원\n\n[입실 안내]\n시간: 오후 4시\n비밀번호: 9999\n\n감사합니다!`;
  
  const separator = isIOS ? '&' : '?';
  const smsUrl = `sms:${phone}${separator}body=${encodeURIComponent(fullBody)}`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>{t.complete.title}</h1>
        <p className={styles.desc}>
          {t.complete.desc}
        </p>

        <div className={styles.smsSection}>
          <a href={smsUrl} className={styles.smsBtn}>
             📱 {t.complete.guestSmsBtn}
          </a>
        </div>
        
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

export default function Complete() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>...</div>}>
      <CompleteContent />
    </Suspense>
  );
}
