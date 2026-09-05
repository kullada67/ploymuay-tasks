import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import HeartClickEffect from '../components/HeartClickEffect'; // นำเข้าคอมโพเนนต์หัวใจ
import SparkleEffect from '../components/SparkleEffect'; 
import { Home, Calendar, FolderHeart } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PloyMuay Tasks',
  description: 'ระบบจัดการตารางงานสุดน่ารัก',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-[#fce4ec] min-h-screen relative text-gray-700`}>
        <HeartClickEffect /> {/* เอฟเฟกต์คลิกแล้วมีรูปหัวใจ 💗 */}
        <SparkleEffect />    {/* กากเพชรสี #fff9c4 ร่วง */}
        
        {/* แถบเมนู Navbar */}
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b-2 border-pink-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-2xl">🎀</span>
                <span className="font-extrabold text-xl text-[#d81b60] tracking-wide">PloyMuay Tasks</span>
              </div>
              <div className="flex space-x-6 text-pink-400 font-medium">
                <a href="#" className="hover:text-[#d81b60] flex items-center gap-1.5 transition-colors"><Home size={18}/> หน้าแรก</a>
                <a href="#" className="hover:text-[#d81b60] flex items-center gap-1.5 transition-colors"><Calendar size={18}/> ปฏิทิน</a>
                <a href="#" className="hover:text-[#d81b60] flex items-center gap-1.5 transition-colors"><FolderHeart size={18}/> ไฟล์งาน</a>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}