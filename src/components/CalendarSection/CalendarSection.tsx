'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReservedDates, BlockedDateInfo, getReservationList, FullReservation } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './CalendarSection.module.css';

export default function CalendarSection() {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // View mode
  const [isListOpen, setIsListOpen] = useState(false);
  
  // Dates
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
  const [reservations, setReservations] = useState<FullReservation[]>([]);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    getReservedDates().then(dates => {
       setBlockedDates(dates);
    });
    getReservationList().then(list => {
       setReservations(list);
    });
  }, []);

  // 모달 오픈 시 본문 스크롤 방지
  useEffect(() => {
    if (isListOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isListOpen]);

  const handleDateClick = (dateStr: string) => {
    const isDateBlocked = blockedDates.some(b => b.date === dateStr);

    if (!checkIn || (checkIn && checkOut)) {
      if (isDateBlocked) {
        const blockedInfo = blockedDates.find(b => b.date === dateStr);
        alert(`${t.calendar.blockedAlert} ${blockedInfo?.maskedName}\n${t.calendar.period} ${blockedInfo?.checkIn} ~ ${blockedInfo?.checkOut}`);
        return;
      }
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      const start = new Date(checkIn);
      const end = new Date(dateStr);
      
      if (end < start) {
        if (isDateBlocked) {
          const blockedInfo = blockedDates.find(b => b.date === dateStr);
          alert(`${t.calendar.blockedAlert} ${blockedInfo?.maskedName}\n${t.calendar.period} ${blockedInfo?.checkIn} ~ ${blockedInfo?.checkOut}`);
          return;
        }
        setCheckIn(dateStr);
        return;
      } else if (end.getTime() === start.getTime()) {
        setCheckOut(null);
        return;
      }
      
      let temp = new Date(start);
      let isValid = true;
      while (temp < end) {
        const tempStr = temp.toISOString().split('T')[0];
        if (blockedDates.some(b => b.date === tempStr)) {
          isValid = false;
          break;
        }
        temp.setDate(temp.getDate() + 1);
      }

      if (!isValid) {
        alert(t.calendar.invalidRange);
        if (!isDateBlocked) {
          setCheckIn(dateStr);
        }
      } else {
        setCheckOut(dateStr);
      }
    }
  };

  const calculateDetailedPrice = (ci?: string, co?: string, g?: number) => {
    const startStr = ci || checkIn;
    const endStr = co || checkOut;
    const gCount = g || guests;
    
    if (!startStr || !endStr) return null;
    
    const start = new Date(startStr);
    const end = new Date(endStr);
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
        
        if (gCount > 1) {
            guestSurcharge += (gCount - 1) * 10000;
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

  interface ListViewItem {
    type: 'available' | 'booked';
    start: number;
    end: number;
    nights?: number;
    total?: number;
    name?: string;
  }

  const renderListView = () => {
    const monthsToShow = [];
    const now = new Date();
    // 현재 월부터 12월까지
    for (let m = now.getMonth(); m <= 11; m++) {
      monthsToShow.push(new Date(now.getFullYear(), m, 1));
    }

    const maskName = (name: string) => {
      if (!name) return "***";
      if (name.length <= 2) return name.substring(0, 1) + "*";
      return name.substring(0, 1) + "*" + name.substring(2);
    };

    return (
      <div className={styles.modalOverlay} onClick={() => setIsListOpen(false)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <header className={styles.modalHeader}>
            <h3>{t.calendar.viewList}</h3>
            <button className={styles.closeBtn} onClick={() => setIsListOpen(false)} aria-label="Close">
              &times;
            </button>
          </header>
          <div className={styles.listView}>
            {monthsToShow.map((mDate) => {
              const year = mDate.getFullYear();
              const month = mDate.getMonth();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              
              const sortedReservations = reservations.filter(r => {
                const rStart = new Date(r.checkIn);
                const rEnd = new Date(r.checkOut);
                const mStart = new Date(year, month, 1);
                const mEnd = new Date(year, month, daysInMonth);
                return (rStart <= mEnd && rEnd >= mStart);
              }).sort((a, b) => a.checkIn.localeCompare(b.checkIn));

              const monthLabel = mDate.toLocaleString(
                language === 'ko' ? 'ko' : language,
                { year: 'numeric', month: 'long' }
              );

              const listItems: ListViewItem[] = [];
              let currentDay = 1;

              sortedReservations.forEach(res => {
                const rStart = new Date(res.checkIn);
                const rEnd = new Date(res.checkOut);
                
                const startDayOfRes = (rStart.getFullYear() === year && rStart.getMonth() === month) ? rStart.getDate() : 1;
                if (startDayOfRes > currentDay) {
                  listItems.push({
                    type: 'available',
                    start: currentDay,
                    end: startDayOfRes - 1
                  });
                }
                
                const endDayOfRes = (rEnd.getFullYear() === year && rEnd.getMonth() === month) ? rEnd.getDate() : daysInMonth;
                if (endDayOfRes >= startDayOfRes) {
                  const resPrice = calculateDetailedPrice(res.checkIn, res.checkOut, res.guests);
                  listItems.push({
                    type: 'booked',
                    start: startDayOfRes,
                    end: endDayOfRes,
                    nights: resPrice?.nights,
                    total: resPrice?.total,
                    name: maskName(res.name)
                  });
                  currentDay = endDayOfRes;
                }
              });

              if (currentDay < daysInMonth) {
                listItems.push({
                  type: 'available',
                  start: currentDay + 1,
                  end: daysInMonth
                });
              }

              return (
                <section key={monthLabel} className={styles.monthSection}>
                  <h4 className={styles.monthHeader}>{monthLabel}</h4>
                  <ul className={styles.monthList}>
                    {listItems.map((item, idx) => (
                      <li key={idx} className={item.type === 'available' ? styles.itemAvailable : styles.itemBooked}>
                        {item.type === 'available' ? (
                          <span>{item.start} ~ {item.end}{t.calendar.Sat.replace(/./, '')}일 {t.calendar.available}</span>
                        ) : (
                          <span>
                            {item.start} - {item.end}일 {item.name} / {item.nights}{t.calendar.days} / {item.total?.toLocaleString()}{t.calendar.won}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container} id="reserve">
      <header className={styles.header}>
        <h2 className={styles.title}>{t.calendar.title}</h2>
        <p className={styles.desc}>{t.contact.desc}</p>
        <button 
          className={styles.viewToggleBtn}
          onClick={() => setIsListOpen(true)}
        >
          {t.calendar.viewList}
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <div className={styles.calHeader}>
              <button onClick={prevMonth} type="button" className={styles.calNav}>&lt;</button>
              <h3 className={styles.calTitle}>
                {currentMonth.toLocaleString(
                  language === 'ko' ? 'ko' : 
                  language === 'en' ? 'en' : 
                  language === 'ja' ? 'ja' : 
                  language === 'zh-CN' ? 'zh-Hans' : 
                  language === 'zh-TW' ? 'zh-Hant' : language,
                  { year: 'numeric', month: 'long' }
                )}
              </h3>
              <button onClick={nextMonth} type="button" className={styles.calNav}>&gt;</button>
            </div>
            
            <div className={styles.weekdays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d}>{t.calendar[d as keyof typeof t.calendar]}</div>
              ))}
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
              <span className={styles.legItem}><span className={styles.box} /> {t.calendar.available}</span>
              <span className={styles.legItem}><span className={`${styles.box} ${styles.booked}`} /> {t.calendar.booked}</span>
              <span className={styles.legItem}><span className={`${styles.box} ${styles.selected}`} /> {t.calendar.selected}</span>
            </div>
            
            {!checkOut && checkIn && (
              <p className={styles.calHint}>{t.calendar.hintSelectOut}</p>
            )}
          </div>

        {isListOpen && renderListView()}

        <div className={styles.reserveAction}>
          {(!checkIn || !checkOut) ? (
            <div className={styles.baseInfoList}>
              <h3>{t.calendar.feeGuideTitle}</h3>
              <ul>
                <li><strong>{t.calendar.feeGuideLines[0]}</strong></li>
                <li>{t.calendar.feeGuideLines[1]}</li>
                <li>{t.calendar.feeGuideLines[2]}</li>
                <li>{t.calendar.feeGuideLines[3]}</li>
                <li><strong>{t.calendar.feeGuideLines[4]}</strong></li>
              </ul>
              <p className={styles.infoHint}>{t.calendar.hintSelectDates}</p>
            </div>
          ) : (
            <>
              {pricing && (
                <div className={styles.pricingDetails}>
                  <div className={styles.stayInfoBox}>
                    <div className={styles.stayDates}>
                      {checkIn} ~ {checkOut}
                    </div>
                    <div className={styles.stayNights}>
                      {pricing.nights}{t.calendar.days} {t.calendar.stay}
                    </div>
                  </div>

                  <div className={styles.guestSelector}>
                    <label htmlFor="guests">{t.calendar.guestSelectLabel}</label>
                    <select 
                      id="guests" 
                      value={guests} 
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className={styles.guestSelect}
                    >
                      <option value={1}>{t.calendar.guestOptions[0]}</option>
                      <option value={2}>{t.calendar.guestOptions[1]}</option>
                      <option value={3}>{t.calendar.guestOptions[2]}</option>
                      <option value={4}>{t.calendar.guestOptions[3]}</option>
                    </select>
                  </div>

                  <div className={styles.pricingCard}>
                    <h3>{t.calendar.finalPriceTitle}</h3>
                    <div className={styles.priceRow}>
                      <span>{t.calendar.baseFee} ({pricing.nights}{t.calendar.days})</span>
                      <span>{pricing.baseNightly.toLocaleString()}{t.calendar.won}</span>
                    </div>
                    {pricing.guestSurcharge > 0 && (
                      <div className={styles.priceRow}>
                        <span>{t.calendar.guestFee}</span>
                        <span>{pricing.guestSurcharge.toLocaleString()}{t.calendar.won}</span>
                      </div>
                    )}
                    {pricing.weekendSurcharge > 0 && (
                      <div className={styles.priceRow}>
                        <span>{t.calendar.weekendFee}</span>
                        <span>{pricing.weekendSurcharge.toLocaleString()}{t.calendar.won}</span>
                      </div>
                    )}
                    <div className={styles.priceRow}>
                      <span>{t.calendar.cleaningFee}</span>
                      <span>{pricing.cleaningFee.toLocaleString()}{t.calendar.won}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className={`${styles.priceRow} ${styles.discount}`}>
                        <span>{t.calendar.longStayDiscount}</span>
                        <span>-{pricing.discount.toLocaleString()}{t.calendar.won}</span>
                      </div>
                    )}
                    <div className={styles.priceTotal}>
                      <span>{t.calendar.finalPriceTitle}</span>
                      <span>{pricing.total.toLocaleString()}{t.calendar.won}</span>
                    </div>
                  </div>
                  
                  <button 
                    className={styles.primaryReserveBtn}
                    onClick={handleReserveClick}
                  >
                    {t.calendar.proceedBtn}
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
