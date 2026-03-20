import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'TangoStay - 한강뷰 도심 속 조용한 숙소',
  description: '도심 속 특별한 휴식, 장기/단기 체류가 가능한 모바일 우선 예약 웹앱입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
