import Link from 'next/link';
import styles from './page.module.css';

export default function Complete() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>예약 요청이 접수되었습니다!</h1>
        <p className={styles.desc}>
          남겨주신 연락처로 일정 확인 후 빠르게 안내해 드리겠습니다.<br/>
          TangoStay를 찾아주셔서 감사합니다.
        </p>
        
        <div className={styles.actions}>
          <Link href="/#guide" className={styles.btnOutline}>
            이용방법 미리보기
          </Link>
          <Link href="/" className={styles.btnPrimary}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
