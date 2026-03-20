'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitReservation } from '@/lib/api';
import styles from './page.module.css';

function ReserveForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = parseInt(searchParams.get('guests') || '1');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!checkIn || !checkOut) {
      alert("비정상적인 접근입니다. 달력에서 예약 날짜를 먼저 선택해주세요.");
      router.push('/');
    }
  }, [checkIn, checkOut, router]);

  if (!checkIn || !checkOut) return null;

  const calculateTotal = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    let baseNightly = 0;
    let guestSurcharge = 0;
    let weekendSurcharge = 0;
    
    const holidays = [
        "2024-01-01", "2024-02-09", "2024-02-12", "2024-03-01", "2024-04-10", "2024-05-05", "2024-05-06",
        "2024-05-15", "2024-06-06", "2024-08-15", "2024-09-16", "2024-09-17", "2024-09-18", "2024-10-03",
        "2024-10-09", "2024-12-25",
        "2025-01-01", "2025-01-28", "2025-01-29", "2025-01-30", "2025-03-03", "2025-05-05", "2025-05-06",
        "2025-06-06", "2025-08-15", "2025-10-03", "2025-10-06", "2025-10-07", "2025-10-08", "2025-10-09", "2025-12-25"
    ];

    for (let i = 0; i < nights; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const day = currentDate.getDay();
        
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        baseNightly += 80000;
        
        if (guests > 1) {
            guestSurcharge += (guests - 1) * 10000;
        }
        
        const isWeekend = day === 5 || day === 6;
        if (isWeekend || holidays.includes(dateStr)) {
            weekendSurcharge += 10000;
        }
    }

    const cleaningFee = 30000;
    let discount = 0;
    if (nights >= 14) discount = 40000;
    else if (nights >= 7) discount = 20000;

    return baseNightly + guestSurcharge + weekendSurcharge + cleaningFee - discount;
  };

  const totalAmount = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("이름(예약자명)을 입력해주세요.");
      return;
    }
    if (!phone.trim()) {
      alert("연락처를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    const formData = {
      name, 
      phone, 
      checkIn, 
      checkOut, 
      guests, 
      message
    };

    const result = await submitReservation(formData);
    
    if (result.success || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      router.push('/complete');
    } else {
      alert('예약 요청 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/#reserve')} className={styles.backBtn}>&larr; 돌아가기</button>
        <h1 className={styles.title}>예약 정보 입력</h1>
        <p className={styles.routeDesc}>
          {checkIn} ~ {checkOut} / {guests}명 / {totalAmount.toLocaleString()}원
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.paymentGuide}>
            <h3>💳 무통장 입금 안내</h3>
            <p className={styles.account}>카카오뱅크 3333-03-7249602 홍병석</p>
            <p className={styles.warning}><strong>예약 접수 후 10분 이내에 입금</strong>하셔야 예약이 최종 확정됩니다.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">이름 (입금자명)</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="입금자명과 동일하게 입력하세요" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">연락처</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">요청사항 / 메모</label>
              <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="입금자명이 다를 경우 꼭 남겨주세요." />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? '접수 중...' : '예약 접수하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>로딩 중...</div>}>
      <ReserveForm />
    </Suspense>
  );
}
