import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <div className={styles.container} id="contact">
      <header className={styles.header}>
        <h2 className={styles.title}>문의하기</h2>
        <p className={styles.desc}>궁금한 점이 있으시다면 언제든 편하게 연락주세요.</p>
      </header>

      <div className={styles.contactGrid}>
        <a href="tel:010-7209-2468" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
          <div className={styles.icon}>📞</div>
          <h3>전화 걸기</h3>
          <p>010-7209-2468 (스톤)</p>
        </a>

        <a href="sms:010-7209-2468" target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
          <div className={styles.icon}>💬</div>
          <h3>문자 보내기</h3>
          <p>빠른 답변이 가능합니다</p>
        </a>

        <a href="https://open.kakao.com/o/sNq0Irmi" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.kakao}`}>
          <div className={styles.icon}>💛</div>
          <h3>카카오 오픈채팅</h3>
          <p>개인 ID: stonehong@kakao.com</p>
        </a>

        <a href="https://wa.me/821072092468" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.whatsapp}`}>
          <div className={styles.icon}>🟩</div>
          <h3>WhatsApp</h3>
          <p>글로벌 게스트 전용</p>
        </a>

        <a href="https://m.me/StoneHong1" target="_blank" rel="noopener noreferrer" className={`${styles.contactCard} ${styles.messenger}`}>
          <div className={styles.icon}>📘</div>
          <h3>FB Messenger</h3>
          <p>페이스북 메시지</p>
        </a>
      </div>
    </div>
  );
}
