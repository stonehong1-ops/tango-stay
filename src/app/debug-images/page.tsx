import React from 'react';

const files = [
  "20260310_181707.jpg",
  "20260310_184549.jpg",
  "20260310_184607.jpg",
  "20260311_140211.jpg",
  "20260316_190008.jpg",
  "20260317_141751.jpg",
  "20260317_143309.jpg",
  "20260318_095315.jpg",
  "20260319_123504.jpg",
  "20260319_123516(1).jpg",
  "20260319_123516.jpg",
  "20260319_123529(1).jpg",
  "20260319_124230.jpg",
  "20260319_130824.jpg",
  "20260320_105309.jpg",
  "20260320_105323.jpg",
  "20260320_132712.jpg",
  "20260320_140636.jpg",
  "20260320_140732.jpg"
];

export default function DebugImages() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', padding: '50px', background: 'white' }}>
      <h1 style={{ fontSize: '4rem', color: 'black' }}>Image Classifier Debug</h1>
      {files.map(f => (
        <div key={f} style={{ border: '4px solid red', padding: '20px' }}>
           <h2 style={{ fontSize: '3rem', color: 'black' }}>{f}</h2>
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src={`/images/${f}`} alt={f} style={{ width: '800px', height: 'auto', display: 'block' }} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
