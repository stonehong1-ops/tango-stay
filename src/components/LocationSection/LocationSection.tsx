import styles from './LocationSection.module.css';

export default function LocationSection() {
  return (
    <section className={styles.container} id="location">
      <h2 className={styles.title}>숙소 위치</h2>
      <p className={styles.address}>
        <strong>도로명:</strong> 서울 마포구 양화로 13<br/>
        <strong>건물명:</strong> 합정스퀘어리버뷰
      </p>

      <div className={styles.mapWrapper}>
        <iframe
          src="https://maps.google.com/maps?q=서울%20마포구%20양화로%2013&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: '12px' }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TangoStay Google Maps"
        />
      </div>

      <div className={styles.buttonGroup}>
        <a 
          href="https://map.naver.com/p/search/서울%20마포구%20양화로%2013" 
          rel="noopener noreferrer"
          className={`${styles.mapBtn} ${styles.naver}`}
        >
          네이버지도 열기
        </a>
        <a 
          href="https://map.kakao.com/link/search/서울 마포구 양화로 13" 
          rel="noopener noreferrer"
          className={`${styles.mapBtn} ${styles.kakao}`}
        >
          카카오맵 열기
        </a>
      </div>
    </section>
  );
}
