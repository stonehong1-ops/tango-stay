import styles from './GuideSection.module.css';

export default function GuideSection() {
  return (
    <div className={styles.container} id="guide">
      <header className={styles.header}>
        <h2 className={styles.title}>상세 정보 및 이용 안내</h2>
        <p className={styles.subtitle}>&quot;준비물 없이 바로 일상을 시작하실 수 있도록 모든 것을 갖췄습니다&quot;</p>
      </header>
      
      <div className={styles.content}>
        
        <details className={styles.accordion} open>
          <summary>✨ 이 방의 핵심 포인트</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              <li>
                <strong>탁 트인 조망의 신축 퀄리티</strong>
                합정·홍대에서 가장 최신 깔끔한 오피스텔의 남다른 한강뷰를 제공합니다.
              </li>
              <li>
                <strong>타협 없는 완벽한 청결</strong>
                이불·패드·커버·러그 매번 런드리고(Laundrygo) 전문 세탁, 실내 스팀청소 진행, 수건과 행주는 아낌없이 매번 전면 새것으로 교체해 드립니다.
              </li>
              <li>
                <strong>프리미엄 휴식 가구</strong>
                넓은 침대 2개(퀸, 슈퍼싱글), 안락한 소파, 성능 강한 리클라이너 안마의자까지 구비되어 있습니다.
              </li>
              <li>
                <strong>풍성한 엔터테인먼트</strong>
                거실에는 2026 삼성 무빙스타일 최신 스마트 TV가, 그리고 침실용 TV가 별도로 마련되어 있습니다.
              </li>
            </ul>
            <p className={styles.quote}>&quot;한강 야경 보면서 안마의자 하세요~&quot;</p>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>📍 편리한 위치 및 교통 (주차 무료)</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              <li>
                <strong>초역세권 입지</strong>
                합정역 도보 1분, 홍대 및 신촌까지 도보/전철/버스로 빠르게 이동 가능 (홍대 도보 10분)
              </li>
              <li>
                <strong>최고의 대중교통</strong>
                서울 강남·북, 동·서로 이동 가능한 모든 버스의 집결지입니다. (망원역, 홍대입구역 모두 인접)
              </li>
              <li>
                <strong>편리한 주차장</strong>
                차량을 가져오셔도 주차 무료로 이용 가능합니다. (월 주차비 3만원 호스트가 전액 부담)
              </li>
              <li>
                <strong>자차 및 택시 이동</strong>
                강남, 일산, 여의도 등 주요 거점으로 향하는 강변북로 진입이 단 1분이면 충분합니다.
              </li>
            </ul>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>🛋️ 구비 옵션 및 시설 (무료 소모품 안내)</summary>
          <div className={styles.accordionContent}>
            <div className={styles.gridList}>
              <div className={styles.gridCol}>
                <h4>기본 제공 가전/가구</h4>
                <p>냉장고, 세탁기, 에어컨, 스마트TV(2대), 기가 와이파이, 싱크대, 인덕션, 퀸사이즈 및 슈퍼싱글 침대</p>
              </div>
              <div className={styles.gridCol}>
                <h4>추가 편의 시설</h4>
                <p>안전한 도어락 및 CCTV/관리실, 식탁, 위생적인 정수기, 푹신한 소파, 넓은 책상, 넉넉한 옷장 및 신발장</p>
              </div>
            </div>
            
            <div className={styles.amenityBox}>
              <strong>✨ 모든 소모품 무료 지원!!!</strong>
              <p>
                라면, 햇반, 두루마리 휴지, 티슈, 칫솔/치약 세트, 샴푸/린스, 바디워시, 핸드워시 등 모든 일회용품과 소모품이 구비되어 있습니다.<br/>
                빨래 건조대와 세탁 세제, 유연제는 물론 쓰레기봉투(큰 봉투, 작은 봉투)와 재활용 봉투까지 전부 자유롭게 무료로 사용하세요!
              </p>
            </div>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>🛡️ 방 이용 및 호스트 소통 가이드</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              <li>
                <strong>🔓 체크인 / 아웃 (조율 가능)</strong>
                비대면 입실 원칙입니다. 입실 당일 공동현관 비밀번호와 호실 정보를 메시지로 먼저 전해드립니다.<br/>
                기본 시간은 <strong>체크인 15:00 / 체크아웃 11:00</strong> 이지만, 편의를 위해 유연하게 조율해 드립니다!
              </li>
              <li>
                <strong>🏠 필수 이용 규칙</strong>
                건물 전체 <strong>절대 금연</strong>입니다. 위반 시 특수 청소비가 청구되니 주의해 주세요.<br/>
                쾌적한 숙박을 위해 분리수거 및 설거지는 퇴실 전 꼭 부탁드립니다.<br/>
                신축 오피스텔이므로 22시 이후의 층간 소음 및 고성방가는 삼가 주세요.
              </li>
              <li>
                <strong>🤩 호스트 소통 (24시간 즉각 대응)</strong>
                새벽 시간을 포함해 24시간 언제든 문의가 가능합니다. 조금이라도 불편한 사항이 있다면 참지 말고 즉시 메시지를 보내주세요!<br/>
                혹시라도 먼저 입실하셨는데 생활 중 꼭 필요한 물품이 없다면 바로 말씀해 주세요. 즉시 당일 구매/배달해 드립니다.
              </li>
            </ul>
          </div>
        </details>

        <details className={styles.accordion}>
          <summary>🛍️ 주변 생활 인프라 및 즐길 거리</summary>
          <div className={styles.accordionContent}>
            <ul className={styles.customList}>
              <li>
                <strong>합정 먹자골목 / 홍대 상권</strong>
                최고의 맛집과 카페가 밀집한 합정 먹자골목과 젊음의 거리 홍대 상권이 도보 거리에 바짝 붙어 있습니다.
              </li>
              <li>
                <strong>편리한 대형 마트</strong>
                가벼운 장보기는 1분 거리의 왕마트를, 대형 생필품 및 먹거리 쇼핑은 도보 5분 거리 홈플러스 대형 마트를 이용하세요.
              </li>
              <li>
                <strong>답답할 땐 언제든 한강으로</strong>
                현관문을 나서면 한강공원 입구까지 걸어서 1분. 망원 한강공원과 완벽하게 인접해 있습니다.
              </li>
            </ul>
          </div>
        </details>

      </div>
    </div>
  );
}
