'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReservedDates, BlockedDateInfo } from '@/lib/api';
import styles from './CalendarSection.module.css';

export default function CalendarSection() {
  const router = useRouter();
  
  // Dates
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    getReservedDates().then(dates => {
       setBlockedDates(dates);
    });
  }, []);

  const handleDateClick = (dateStr: string) => {
    const blockedInfo = blockedDates.find(b => b.date === dateStr);
    if (blockedInfo) {
       alert(`[예약 마감]\n예약자: ${blockedInfo.maskedName}\n기간: ${blockedInfo.checkIn} ~ ${blockedInfo.checkOut}`);
       return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      const start = new Date(checkIn);
      const end = new Date(dateStr);
      
      if (end < start) {
        setCheckIn(dateStr);
        return;
      } else if (end.getTime() === start.getTime()) {
        setCheckOut(null);
        return;
      }
      
      let temp = new Date(start);
      let isValid = true;
      while (temp < end) {
        if (blockedDates.some(b => b.date === temp.toISOString().split('T')[0])) {
          isValid = false;
          break;
        }
        temp.setDate(temp.getDate() + 1);
      }

      if (!isValid) {
        alert("선택하신 기간 사이에 예약된 날짜가 포함되어 있습니다. 다시 선택해 주세요.");
        setCheckIn(dateStr);
      } else {
        setCheckOut(dateStr);
      }
    }
  };

  const calculateDetailedPrice = () => {
    if (!checkIn || !checkOut) return null;
    
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
        
        // 날짜를 YYYY-MM-DD 형태로 변환 (로컬 시간 기준 오류 방지 위해 직접 조합식 사용)
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

    const total = baseNightly + guestSurcharge + weekendSurcharge + cleaningFee - discount;

    return { nights, baseNightly, guestSurcharge, weekendSurcharge, cleaningFee, discount, total };
  };

  const pricing = calculateDetailedPrice();

  const handleReserveClick = () => {
    if (!checkIn || !checkOut) return;
    router.push(`/reserve?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const days: (string | null)[] = Array.from({ length: firstDay }, () => null);
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push(dStr);
  }

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  return (
    <div className={styles.container} id="reserve">
      <header className={styles.header}>
        <h2 className={styles.title}>실시간 예약</h2>
        <p className={styles.desc}>원하시는 숙박 일정을 선택해주세요.</p>
      </header>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className={styles.calHeader}>
            <button onClick={prevMonth} type="button" className={styles.calNav}>&lt;</button>
            <h3 className={styles.calTitle}>{year}년 {month + 1}월</h3>
            <button onClick={nextMonth} type="button" className={styles.calNav}>&gt;</button>
          </div>
          
          <div className={styles.weekdays}>
            {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
          </div>
          
          <div className={styles.daysGrid}>
            {days.map((dStr, idx) => {
              if (!dStr) return <div key={`empty-${idx}`} className={styles.emptyDay} />;
              
              const isBlocked = blockedDates.some(b => b.date === dStr);
              const isPast = dStr < todayStr;
              const isToday = dStr === todayStr;
              const isCheckIn = checkIn === dStr;
              const isCheckOut = checkOut === dStr;
              const isInRange = checkIn && checkOut && dStr > checkIn && dStr < checkOut;
              
              let classNames = `${styles.dayBtn}`;
              if (isPast) classNames += ` ${styles.past}`;
              if (isToday) classNames += ` ${styles.today}`;
              if (isBlocked) classNames += ` ${styles.booked}`;
              if (isCheckIn || isCheckOut) classNames += ` ${styles.selected}`;
              if (isInRange) classNames += ` ${styles.inRange}`;

              const dayNum = parseInt(dStr.split('-')[2]);

              return (
                <button 
                  key={dStr} 
                  type="button" 
                  disabled={isPast}
                  className={classNames}
                  onClick={() => handleDateClick(dStr)}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
          <div className={styles.legend}>
            <span className={styles.legItem}><span className={styles.box} /> 예약 가능</span>
            <span className={styles.legItem}><span className={`${styles.box} ${styles.booked}`} /> 예약 마감</span>
            <span className={styles.legItem}><span className={`${styles.box} ${styles.selected}`} /> 선택됨</span>
          </div>
          
          {!checkOut && checkIn && (
            <p className={styles.calHint}>체크아웃 날짜를 선택해주세요!</p>
          )}
        </div>

        <div className={styles.reserveAction}>
          {(!checkIn || !checkOut) ? (
            <div className={styles.baseInfoList}>
              <h3>이용 요금 안내</h3>
              <ul>
                <li><strong>1인 1박 8만원</strong></li>
                <li>1인 추가 시 1만원 추가 (최대 4인)</li>
                <li>금, 토, 공휴일 1만원 추가</li>
                <li>퇴실 청소비 3만원</li>
                <li>1주 (7일 이상) 예약 시 <strong>2만원 장기 숙박 할인</strong></li>
              </ul>
              <p className={styles.infoHint}>달력에서 날짜를 선택하시면 정확한 금액이 계산됩니다.</p>
            </div>
          ) : (
            <>
              {pricing && (
                <div className={styles.pricingDetails}>
                  <div className={styles.guestSelector}>
                    <label htmlFor="guests">투숙 인원</label>
                    <select 
                      id="guests" 
                      value={guests} 
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className={styles.guestSelect}
                    >
                      <option value={1}>1명 (기본)</option>
                      <option value={2}>2명 (+10,000원/박)</option>
                      <option value={3}>3명 (+20,000원/박)</option>
                      <option value={4}>4명 (최대, +30,000원/박)</option>
                    </select>
                  </div>

                  <div className={styles.pricingCard}>
                    <h3>최종 결제 금액</h3>
                    <div className={styles.priceRow}>
                      <span>기본 숙박 요금 ({pricing.nights}박)</span>
                      <span>{pricing.baseNightly.toLocaleString()}원</span>
                    </div>
                    {pricing.guestSurcharge > 0 && (
                      <div className={styles.priceRow}>
                        <span>인원 추가 요금</span>
                        <span>{pricing.guestSurcharge.toLocaleString()}원</span>
                      </div>
                    )}
                    {pricing.weekendSurcharge > 0 && (
                      <div className={styles.priceRow}>
                        <span>주말 및 공휴일 추가</span>
                        <span>{pricing.weekendSurcharge.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className={styles.priceRow}>
                      <span>퇴실 청소비</span>
                      <span>{pricing.cleaningFee.toLocaleString()}원</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className={`${styles.priceRow} ${styles.discount}`}>
                        <span>장기 숙박 할인</span>
                        <span>-{pricing.discount.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className={styles.priceTotal}>
                      <span>총 결제 금액</span>
                      <span>{pricing.total.toLocaleString()}원</span>
                    </div>
                  </div>
                  
                  <button 
                    className={styles.primaryReserveBtn}
                    onClick={handleReserveClick}
                  >
                    예약 진행하기
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
