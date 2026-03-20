import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // 외부 기기(휴대폰)에서 접속할 때 Next.js 개발 서버 HMR 소켓이 차단되는 문제 해결
  allowedDevOrigins: [
    '172.30.1.96',
    '192.168.137.1',
  ],
};

export default nextConfig;
