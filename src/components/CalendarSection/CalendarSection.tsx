'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReservedDates, BlockedDateInfo, getReservationList, FullReservation, cancelReservation } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './CalendarSection.module.css';

export default function CalendarSection({ stayId = 'hapjeong' }: { stayId?: string }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // @ts-ignore
  const stayCal = t.stays[stayId]?.calendar || t.stays.hapjeong.calendar;

  // View mode
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedResForDetail, setSelectedResForDetail] = useState<FullReservation | null>(null);
  
  // Dates
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDateInfo[]>([]);
  const [reservations, setReservations] = useState<FullReservation[]>([]);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    getReservedDates(stayId).then(dates => {
       setBlockedDates(dates);
    });
    getReservationList(stayId).then(list => {
       setReservations(list);
    });
  }, [stayId]);

  // 모달 오픈 시 본문 스크롤 방지
  useEffect(() => {
    if (isListOpen || selectedResForDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isListOpen, selectedResForDetail]);

  const handleDateClick = async (dateStr: string) => {
    const isDateBlocked = blockedDates.some(b => b.date === dateStr);

    if (!checkIn || (checkIn && checkOut)) {
      if (isDateBlocked) {
        const fullRes = reservations.find(r => 
          dateStr >= r.checkIn && dateStr < r.checkOut
        );
        if (fullRes) {
          setSelectedResForDetail(fullRes);
        }
        return;
      }
      setCheckIn(dateStr);
      setCheckOut(null);

      // 다음 날이 예약되어 있다면 자동으로 체크아웃으로 설정 (편의 기능)
      const nextDay = new Date(dateStr);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      if (blockedDates.some(b => b.date === nextDayStr)) {
        setCheckOut(nextDayStr);
      }
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
        
        const basePrice = stayId === 'deokeun' ? 60000 : 80000;
        baseNightly += basePrice;
        
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
    router.push(`/reserve?stayId=${stayId}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
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
    isContinued?: boolean;
    isSpanning?: boolean;
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
              let nextPossibleDay = 1;

              sortedReservations.forEach(res => {
                const rStart = new Date(res.checkIn);
                const rEnd = new Date(res.checkOut);
                
                const startDayOfRes = (rStart.getFullYear() === year && rStart.getMonth() === month) ? rStart.getDate() : 1;
                
                if (startDayOfRes > nextPossibleDay) {
                  listItems.push({
                    type: 'available',
                    start: nextPossibleDay,
                    end: startDayOfRes
                  });
                }
                
                const endDayOfRes = (rEnd.getFullYear() === year && rEnd.getMonth() === month) ? rEnd.getDate() : daysInMonth;
                
                const isContinued = rStart.getMonth() !== month || rStart.getFullYear() !== year;
                const isSpanning = rEnd.getMonth() !== month || rEnd.getFullYear() !== year;

                if (endDayOfRes >= startDayOfRes) {
                  const resPrice = calculateDetailedPrice(res.checkIn, res.checkOut, res.guests);
                  listItems.push({
                    type: 'booked',
                    start: startDayOfRes,
                    end: endDayOfRes,
                    nights: resPrice?.nights,
                    total: resPrice?.total,
                    name: maskName(res.name),
                    isContinued,
                    isSpanning
                  });
                  nextPossibleDay = endDayOfRes;
                }
              });

              if (nextPossibleDay < daysInMonth) {
                listItems.push({
                  type: 'available',
                  start: nextPossibleDay,
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
                          <span>{item.start} ~ {item.end}일 {t.calendar.available}</span>
                        ) : (
                          <span className={item.isContinued ? styles.continuedItem : ''}>
                            {item.isContinued ? '↳ ' : ''}
                            {item.start} - {item.end}일 {item.name} / 
                            {item.isContinued || item.isSpanning ? ` (총 ${item.nights}${t.calendar.days}) ` : ` ${item.nights}${t.calendar.days} `} / 
                            {item.total?.toLocaleString()}{t.calendar.won} 
                            {item.isSpanning ? ' →' : ''}
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
  
  const renderDetailModal = () => {
    if (!selectedResForDetail) return null;
    const res = selectedResForDetail;

    const maskName = (name: string) => {
      if (name.length <= 1) return name;
      if (name.length === 2) return name[0] + '*';
      return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    };

    const calculateNights = (checkIn: string, checkOut: string) => {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diffTime;
    };

    const nights = calculateNights(res.checkIn, res.checkOut);

    const handleCancel = async () => {
      const confirmMsg = language === 'ko' 
        ? '정말 이 예약을 취소(삭제)하시겠습니까?' 
        : 'Are you sure you want to cancel this reservation?';
      
      if (window.confirm(confirmMsg)) {
        const result = await cancelReservation(res.id);
        if (result.success) {
          alert(language === 'ko' ? '취소되었습니다.' : 'Cancelled successfully.');
          setSelectedResForDetail(null);
          // 데이터 새로고침
          const [dates, list] = await Promise.all([getReservedDates(), getReservationList()]);
          setBlockedDates(dates);
          setReservations(list);
        }
      }
    };

    return (
      <div className={styles.modalOverlay} onClick={() => setSelectedResForDetail(null)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <header className={styles.modalHeader}>
            <h3>{language === 'ko' ? '예약 상세 정보' : 'Reservation Detail'}</h3>
            <button className={styles.closeBtn} onClick={() => setSelectedResForDetail(null)} aria-label="Close">
              &times;
            </button>
          </header>
          <div className={styles.detailBody}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{language === 'ko' ? '예약자' : 'Guest'}</span>
              <span className={styles.detailValue}>{maskName(res.name)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{language === 'ko' ? '연락처' : 'Contact'}</span>
              <span className={styles.detailValue}>{res.phone}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{language === 'ko' ? '기간' : 'Period'}</span>
              <span className={styles.detailValue}>
                {res.checkIn} ~ {res.checkOut}
                <span className={styles.nightCount}>
                  ({nights}{language === 'ko' ? '박' : ' Nights'})
                </span>
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{language === 'ko' ? '인원' : 'Guests'}</span>
              <span className={styles.detailValue}>{res.guests}{language === 'ko' ? '명' : ' Guests'}</span>
            </div>
            {res.message && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{language === 'ko' ? '요청사항' : 'Request'}</span>
                <p className={styles.detailText}>{res.message}</p>
              </div>
            )}
          </div>
          <footer className={styles.modalFooter}>
            <button className={styles.secondaryBtn} onClick={() => setSelectedResForDetail(null)}>
              {language === 'ko' ? '닫기' : 'Close'}
            </button>
            <button className={styles.deleteBtn} onClick={handleCancel}>
              {language === 'ko' ? '취소(삭제)' : 'Cancel (Delete)'}
            </button>
          </footer>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container} id="reserve">
      <header className={styles.header}>
        <h2 className={styles.title}>{stayCal.title}</h2>
        <p className={styles.desc}>{t.common.contact.desc}</p>
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
        {selectedResForDetail && renderDetailModal()}

        <div className={styles.reserveAction}>
          {(!checkIn || !checkOut) ? (
            <div className={styles.baseInfoList}>
              <h3>{stayCal.feeGuideTitle}</h3>
              <ul>
                <li><strong>{stayCal.feeGuideLines[0]}</strong></li>
                <li>{stayCal.feeGuideLines[1]}</li>
                <li>{stayCal.feeGuideLines[2]}</li>
                <li>{stayCal.feeGuideLines[3]}</li>
                <li><strong>{stayCal.feeGuideLines[4]}</strong></li>
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
