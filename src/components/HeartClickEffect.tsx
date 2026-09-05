'use client'; // บังคับให้ไฟล์นี้ทำงานฝั่ง Client

import { useEffect } from 'react';

export default function HeartClickEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // สร้าง element สำหรับรูปหัวใจ
      const heart = document.createElement('div');
      heart.innerHTML = ''; // สามารถเปลี่ยนเป็น SVG หรือรูปอื่นได้
      heart.className = 'floating-heart';
      
      // กำหนดตำแหน่งให้อยู่ตรงจุดที่คลิกพอดี (ลบ 15px เพื่อให้อยู่ตรงกลางเมาส์)
      heart.style.left = `${e.pageX - 15}px`;
      heart.style.top = `${e.pageY - 15}px`;
      
      document.body.appendChild(heart);

      // ลบรูปหัวใจทิ้งเมื่อแอนิเมชันจบ (1 วินาที)
      setTimeout(() => {
        heart.remove();
      }, 1000);
    };

    // ดักจับการคลิกทั่วทั้งหน้าเว็บ
    document.addEventListener('click', handleClick);
    
    // คืนค่าและลบ event ออกเมื่อไม่ได้ใช้งาน
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // คอมโพเนนต์นี้ไม่ต้องแสดง UI ปกติ จึง return null
}