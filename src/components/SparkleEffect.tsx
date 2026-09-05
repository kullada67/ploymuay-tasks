'use client';

import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function SparkleEffect() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // สร้างละอองดาว/กากเพชรจำนวน 30 ชิ้น
    const sparkleCount = 30;
    const initialSparkles: Sparkle[] = Array.from({ length: sparkleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // ตำแหน่งแนวนอน (%)
      y: Math.random() * 100, // ตำแหน่งแนวตั้งเริ่มต้น (%)
      size: Math.random() * 8 + 6, // ขนาด 6px - 14px
      duration: Math.random() * 3 + 2, // ความเร็วในการร่วง (2 - 5 วินาที)
      delay: Math.random() * 5, // ดีเลย์การเริ่ม
    }));
    setSparkles(initialSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-fall"
          style={{
            left: `${s.x}%`,
            top: `-10%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: '#fff9c4',
            boxShadow: '0 0 8px #fff9c4, 0 0 12px #fff',
            animation: `fallAndSpin ${s.duration}s linear infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}