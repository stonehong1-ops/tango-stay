'use client';

import { STAYS } from '@/constants/stays';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './StaySelector.module.css';

interface StaySelectorProps {
  selectedStayId: string;
  onSelect: (id: string) => void;
}

export default function StaySelector({ selectedStayId, onSelect }: StaySelectorProps) {
  const { t } = useLanguage();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {STAYS.map((stay) => {
          // @ts-ignore - t.stays dynamic indexing
          const stayName = t.stays[stay.id]?.name || stay.id;
          const preparingText = t.calendar.checkin === 'Check-in' ? '(Preparing)' : '(준비중)';
          const displayName = stay.isPreparing ? `${stayName} ${preparingText}` : stayName;

          return (
            <button
              key={stay.id}
              className={`${styles.stayBtn} ${selectedStayId === stay.id ? styles.active : ''}`}
              onClick={() => onSelect(stay.id)}
              disabled={stay.isPreparing}
            >
              {displayName}
            </button>
          )
        })}
      </div>
    </div>
  );
}
