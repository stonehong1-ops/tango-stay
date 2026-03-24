'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { submitReservation } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './page.module.css';

function ReserveForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const stayId = searchParams.get('stayId') || 'hapjeong'; // stayId 추가
  const guests = parseInt(searchParams.get('guests') || '1');
  
  // @ts-ignore
  const stayCal = t.stays[stayId]?.calendar || t.stays.hapjeong.calendar;
  // @ts-ignore
  const stayRes = t.stays[stayId]?.reserve || t.stays.hapjeong.reserve;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+82');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!checkIn || !checkOut) {
      alert(t.calendar.hintSelectDates);
      router.push('/');
    }
  }, [checkIn, checkOut, router, t]);

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
    if (!name.trim() || !phone.trim()) {
      alert(t.reserve.errorFill);
      return;
    }

    setIsSubmitting(true);
    
    const cleanPhone = phone.replace(/-/g, '').trim();
    const fullPhone = countryCode + cleanPhone;

    const formData = {
      stayId, // stayId 추가
      name: name.trim(), 
      phone: fullPhone, 
      checkIn, 
      checkOut, 
      guests, 
      message
    };

    const result = await submitReservation(formData);
    
    if (result.success || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const params = new URLSearchParams({
        stayId, // stayId 전달
        name: name.trim(),
        phone: countryCode + cleanPhone,
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: guests.toString(),
        total: totalAmount.toString(),
        msg: message
      });
      router.push(`/complete?${params.toString()}`);
    } else {
      alert(t.reserve.errorFail);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/#reserve')} className={styles.backBtn}>&larr; {t.calendar.clearBtn}</button>
        <h1 className={styles.title}>{t.reserve.title}</h1>
        <p className={styles.routeDesc}>
          {checkIn} ~ {checkOut} / {guests}{t.reserve.guests} / {totalAmount.toLocaleString()}{t.calendar.won}
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.paymentGuide}>
            <h3>💳 {t.calendar.feeGuideTitle} (Deposit)</h3>
            <p className={styles.account}>KakaoBank 3333-03-7249602 (Hong Byeong-seok)</p>
            <p className={styles.warning}><strong>{t.complete.desc}</strong></p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{t.reserve.nameLabel} <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder={t.reserve.namePlace} 
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">{t.reserve.phoneLabel} <span className={styles.required}>*</span></label>
              <div className={styles.phoneInputContainer}>
                <select 
                  className={styles.countrySelect}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+82">KR (+82)</option>
                  <option value="+1">US (+1)</option>
                  <option value="+81">JP (+81)</option>
                  <option value="+86">CN (+86)</option>
                  <option value="+84">VN (+84)</option>
                  <option value="+63">PH (+63)</option>
                  <option value="+66">TH (+66)</option>
                  <option value="+65">SG (+65)</option>
                  <option value="+60">MY (+60)</option>
                  <option value="+886">TW (+886)</option>
                  <option value="+34">ES (+34)</option>
                  <option value="+33">FR (+33)</option>
                  <option value="+39">IT (+39)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+49">DE (+49)</option>
                  <option value="+90">TR (+90)</option>
                </select>
                <input 
                  type="tel" 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder={t.reserve.phonePlace} 
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">{t.reserve.reqLabel}</label>
              <textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                rows={3} 
                placeholder={t.reserve.reqPlace} 
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? t.reserve.submitting : t.reserve.submitBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReservePage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div style={{ padding: '5rem', textAlign: 'center' }}>...</div>}>
      <ReserveForm />
    </Suspense>
  );
}
