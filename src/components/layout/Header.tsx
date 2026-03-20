'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="#" className={styles.logo} onClick={closeMenu}>
          TangoStay
        </Link>
        
        <div className={styles.rightActions}>
          <a href="#reserve" className={styles.reserveBtn} onClick={closeMenu}>
            예약하기
          </a>
          
          <button 
            className={styles.hamburgerBtn} 
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></div>
            <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></div>
            <div className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <a href="#intro" onClick={closeMenu}>탱고스테이 스토리</a>
            <a href="#location" onClick={closeMenu}>숙소 위치</a>
            <a href="#guide" onClick={closeMenu}>상세 정보 및 이용 안내</a>
            <a href="#contact" onClick={closeMenu}>문의하기</a>
          </nav>
        </div>
      )}
    </header>
  );
}
