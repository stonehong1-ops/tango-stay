import Image from 'next/image';
import styles from './IntroSection.module.css';

export default function IntroSection() {
  return (
    <div className={styles.container} id="intro">
      <header className={styles.header}>
        <h2 className={styles.title}>탱고스테이 스토리</h2>
        <p className={styles.subtitle}>&quot;그냥 몸만 오세요&quot;… 탱고스테이의 <strong>[무인도 실험]</strong>을 소개합니다.</p>
      </header>

      <div className={styles.content}>
        <article className={styles.storyBlock}>
          <p className={styles.leadParagraph}>
            제가 호스트로서 이 공간을 준비하며 세운 단 하나의 목표, 바로 <strong>&apos;무인도 실험&apos;</strong>입니다. 
            아무것도 준비하지 않고 캐리어 하나만 들고 들어와도 일주일 이상 문밖으로 한 발자국도 나가지 않고 완벽하게 편안한 생활이 가능한 공간을 만드는 것. 
            제가 겪었던 &apos;게스트로서의 수많은 불편함&apos;을 완벽하게 해결하기 위해 이 공간을 기획했습니다.
          </p>

          <div className={styles.solutionList}>
            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>🎁</div>
              <div className={styles.solText}>
                <h4>입주 체류팩: 찝찝함 ZERO, 웰컴 기프트 박스</h4>
                <p>더 이상 남이 쓰던 수건이나 비누 때문에 찝찝해하지 마세요. 모든 게스트분께 새 수건, 새 행주, 새 비누, 치약 칫솔 등 호텔 어메니티 수준의 소모품을 <strong>전부 새 제품</strong>으로 제공합니다. 도착 첫날 편의점을 가실 필요가 없습니다.</p>
              </div>
            </div>

            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>💧</div>
              <div className={styles.solText}>
                <h4>물 걱정 끝! 최신 정수기 설치</h4>
                <p>매번 무거운 생수병을 사다 나르는 고통에서 해방되세요. 최신 정수기가 설치되어 있어 언제든지 맑고 시원한 물을 마음껏 드실 수 있습니다.</p>
              </div>
            </div>

            <div className={styles.solutionItem}>
              <div className={styles.solIcon}>✨</div>
              <div className={styles.solText}>
                <h4>타협 없는 청결 (전문 세탁 런드리고)</h4>
                <p>모든 침구류(이불, 커버, 패드, 베개피)와 바닥 러그는 두 벌씩 돌아가며 <strong>전문 업체(런드리고)의 고온 살균 및 건조</strong>를 거칩니다. 눈에 보이지 않는 진드기까지 완벽하게 소독된 뽀송뽀송한 침구에서 깊고 편안한 잠을 경험해 보세요.</p>
              </div>
            </div>
          </div>
          
          <p className={styles.conclusion}>
            세상에서 가장 편안한 저의 &apos;무인도&apos;에서 진정한 휴식을 즐기실 여러분을 기다리겠습니다.
          </p>
        </article>

        <hr className={styles.divider} />

        <div className={styles.hostProfile}>
          <div className={styles.hostAvatar}>
            <Image 
              src="/images/stonehong.jpg" 
              alt="Host Stone" 
              width={80} 
              height={80} 
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.hostInfo}>
            <h3 className={styles.hostName}>👋 아르헨티나 탱고 추는 남자 스톤입니다.</h3>
            <p className={styles.hostBio}>
              저는 경영학과 Artificial Intelligence를 전공하고 경영혁신과 관련한 회사 및 기업활동을 해 왔습니다. 여러분 대부분이 사용하고 있는 꽤 유명한 앱들의 총괄 기획자이기도 합니다.<br/><br/>
              얼마전부터는 모든 사회생활을 접고 탱고 인스트럭터로, 탱고 연구자로 남은 인생을 꾸미고 있습니다. 좋은 스테이를 만들어보자는 고민 끝에 1호점, 2호점을 준비해 나가고 있습니다. 
              불편한 부분은 언제든 말씀해주시면 조금씩 더 완벽하게 채워나가겠습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
