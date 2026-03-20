'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';

const categories = ['전체', '거실', '침실', '키친', '화장실', '뷰'];

const imageData = [
  // 거실
  { id: 'img-1', category: '거실', src: '/images/20260317_143309.jpg', desc: '거실, 책상(화장대), 2인용 식탁' },
  { id: 'img-2', category: '거실', src: '/images/20260320_105323.jpg', desc: '높은 층고의 프리미엄 오피스텔' },
  { id: 'img-3', category: '거실', src: '/images/20260319_130824.jpg', desc: '휴식과 식사가 가능한 구조' },
  { id: 'img-4', category: '거실', src: '/images/20260318_095315.jpg', desc: '2026 삼성 스마트티빙 M7 / 책상 겸 화장대' },
  { id: 'img-5', category: '거실', src: '/images/20260311_140211.jpg', desc: 'TV채널 및 OTT 프리미엄 무료 이용 (개인설정도 가능)' },
  { id: 'img-6', category: '거실', src: '/images/20260320_105309.jpg', desc: '카카오파크' },
  
  // 침실
  { id: 'img-8', category: '침실', src: '/images/20260319_123504.jpg', desc: '이케아 프리미엄 침구 (퀸 사이즈)' },
  { id: 'img-9', category: '침실', src: '/images/20260319_123516.jpg', desc: '침실용 TV' },
  { id: 'img-10', category: '침실', src: '/images/20260319_124230.jpg', desc: '리클라이너 안마의자 (성능 강함)' },
  { id: 'img-11', category: '침실', src: '/images/20260319_123529(1).jpg', desc: '에이스 싱글 침대와 이케아 침구' },
  { id: 'img-12-b', category: '침실', src: '/images/20260320_140636.jpg', desc: '3인 숙박 가능 (거실 소파 이용도 가능)' },
  
  // 키친
  { id: 'img-12-a', category: '키친', src: '/images/20260317_141751.jpg', desc: '정수기, 조리도구, 조미료, 1회용품 등 완비' },
  { id: 'img-13', category: '키친', src: '/images/20260310_181707.jpg', desc: '삼성냉장고와 삼성세탁기' },
  
  // 화장실
  { id: 'img-14', category: '화장실', src: '/images/20260313_155116.jpg', desc: '세면대, 화장실, 샤워실 분리' },
  { id: 'img-15', category: '화장실', src: '/images/20260313_155135.jpg', desc: '샴푸, 린스, 바디워시 완비' },
  { id: 'img-16', category: '화장실', src: '/images/20260320_132712.jpg', desc: '비데사용 가능' },
  
  // 뷰
  { id: 'img-17', category: '뷰', src: '/images/20260316_190008.jpg', desc: '한강뷰와 시원한 강바람' },
  { id: 'img-18', category: '뷰', src: '/images/20260310_184549.jpg', desc: '한강공원 1분거리' },
  { id: 'img-19', category: '뷰', src: '/images/20260310_184607.jpg', desc: '한강뷰와 시티뷰' },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % imageData.length);
    }
    if (isRightSwipe && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + imageData.length) % imageData.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        if (window.location.hash === '#gallery') window.history.back();
        else setLightboxIndex(null);
      }
      if (e.key === 'ArrowRight') setLightboxIndex(prev => prev !== null ? (prev + 1) % imageData.length : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => prev !== null ? (prev - 1 + imageData.length) % imageData.length : null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    window.history.pushState({ lightbox: true }, '', '#gallery');
  };

  const closeLightbox = () => {
    if (window.location.hash === '#gallery') {
      window.history.back();
    } else {
      setLightboxIndex(null);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#gallery') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % imageData.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + imageData.length) % imageData.length);
    }
  };

  return (
    <div className={styles.galleryContainer}>
      {/* 1. Main Hero Image */}
      <div 
        className={styles.mainImageWrapper} 
        onClick={() => openLightbox(0)}
      >
        <Image 
          src={imageData[0].src} 
          alt="TangoStay 메인 사진" 
          fill
          className={styles.mainImage}
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <button className={styles.seeMoreBtn}>
          사진 모두 보기 ({imageData.length}장)
        </button>
      </div>

      {/* 2. Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>&times;</button>
          
          <button className={styles.lightboxPrev} onClick={prevImage}>&#10094;</button>
          
          <div 
            className={styles.lightboxImageContainer} 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image 
              src={imageData[lightboxIndex].src} 
              alt={imageData[lightboxIndex].category} 
              fill 
              className={styles.lightboxImage}
              sizes="100vw"
              priority
            />
            
            <div className={styles.captionOverlay}>
               <h3 className={styles.captionTitle}>{imageData[lightboxIndex].desc}</h3>
               <p className={styles.captionCategory}>{imageData[lightboxIndex].category} - {lightboxIndex + 1} / {imageData.length}</p>
            </div>
          </div>
          
          <button className={styles.lightboxNext} onClick={nextImage}>&#10095;</button>
        </div>
      )}
    </div>
  );
}
