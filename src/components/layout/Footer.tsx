'use client';

import { useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const [modalType, setModalType] = useState<'term' | 'privacy' | null>(null);

  const termText = `[이용약관]

제1조(목적)
본 약관은 프리스타일 탱고스테이가 제공하는 숙박 서비스의 이용과 관련하여 호스트와 게스트 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조(서비스 제공 및 변경)
1. 탱고스테이는 게스트에게 명시된 숙박 공간 및 모든 부대 시설(무료 소모품 포함)을 제공합니다.
2. 숙소 내 기물 파손 시, 호스트는 게스트에게 실비 배상을 청구할 수 있습니다.

제3조(게스트의 의무)
1. 게스트는 숙소 내에서 흡연, 고성방가(22시 이후) 등 타인에게 피해를 주는 행위를 금합니다.
2. 위반 시 강제 퇴실 조치 될 수 있으며, 특수 청소비용이 청구될 수 있습니다.`;

  const privacyText = `[개인정보처리방침]

1. 수집하는 개인정보 항목
탱고스테이는 원활한 숙박 예약 및 호스트-게스트 간의 소통을 위해 아래의 개인정보를 수집하고 있습니다.
- 수집항목: 예약자 이름, 연락처(전화번호), 예약 일정

2. 개인정보의 수집 및 이용 목적
- 숙소 공동출입문 및 객실 도어락 비밀번호 안내
- 결제 및 예약 확인, 체류 품질 관리를 위한 고객 응대

3. 개인정보의 보존 기간
- 원칙적으로 개인정보 수집 및 이용목적이 달성된 후(퇴실 후 1개월)에는 해당 정보를 지체 없이 완전히 파기합니다.`;

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.links}>
            <button onClick={() => setModalType('term')} className={styles.linkBtn}>이용약관</button>
            <span className={styles.divider}>|</span>
            <button onClick={() => setModalType('privacy')} className={styles.linkBtn}>개인정보처리방침</button>
          </div>
          <p className={styles.copyright}>© {new Date().getFullYear()} TangoStay. All rights reserved.</p>
        </div>
      </footer>

      {modalType && (
        <div className={styles.modalOverlay} onClick={() => setModalType(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setModalType(null)}>&times;</button>
            <h3 className={styles.modalTitle}>{modalType === 'term' ? '이용약관' : '개인정보처리방침'}</h3>
            <pre className={styles.modalText}>{modalType === 'term' ? termText : privacyText}</pre>
          </div>
        </div>
      )}
    </>
  );
}
