'use client';

import { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { UploadCloud, Plus, CheckCircle2, Clock, Sparkles, X, FileText, Trash2, Download } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  fileName: string | null;
  fileUrl: string | null;
  completed: boolean;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Home() {
  const [date, setDate] = useState<Value>(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileObjectUrl, setFileObjectUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = date instanceof Date ? formatDateString(date) : formatDateString(new Date());
  const filteredTasks = tasks.filter(task => task.date === selectedDateStr);

  const toggleTask = async (id: number, currentStatus: boolean) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !currentStatus } : task
    ));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUploadedFile(file);
      setFileObjectUrl(fileUrl);
      setIsModalOpen(true);
      setNewTaskTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          date: selectedDateStr,
          time: newTaskTime || '00:00',
          fileName: uploadedFile ? uploadedFile.name : null,
          fileUrl: fileObjectUrl || null,
        }),
      });

      if (res.ok) {
        fetchTasks();
        setIsModalOpen(false);
        setNewTaskTitle('');
        setNewTaskTime('');
        setUploadedFile(null);
        setFileObjectUrl(null);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="animate-fade-in mt-2 relative pb-10">
      
      {/* ส่วนหัวต้อนรับ */}
      <div className="mb-8 relative overflow-hidden rounded-[2.5rem] shadow-sm border-2 border-pink-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 z-0"
          style={{ backgroundImage: `url('/melody-bg.jpg')` }}
        ></div>

        <div className="relative z-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl w-full flex flex-col md:flex-row justify-between items-center border border-pink-100 shadow-sm gap-4">
          <div className="flex items-center gap-4 w-full">
            <img 
              src="/cat-hi.jpg" 
              alt="Cat Greeting" 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-pink-300 shadow-sm shrink-0"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1 flex items-center gap-2" style={{ color: '#f8bbd0' }}>
                ยินดีต้อนรับนะคะ <Sparkles size={26} style={{ color: '#f8bbd0' }} />
              </h1>
              <p className="font-medium text-sm md:text-base" style={{ color: '#f8bbd0' }}>
                hope you have a great day! จัดการตารางงานไว้ในที่เดียว 🌸
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ฝั่งซ้าย: ปฏิทินและกล่องอัปโหลด */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border-2 border-pink-100 overflow-hidden relative">
            {isMounted ? (
              <Calendar 
                onChange={setDate} 
                value={date} 
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dateStr = formatDateString(date);
                    const hasTask = tasks.some(task => task.date === dateStr);
                    if (hasTask) {
                      return <div className="flex justify-center mt-1"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#f8bbd0' }}></div></div>;
                    }
                  }
                  return null;
                }}
              />
            ) : (
              <div className="h-[300px] bg-pink-50 animate-pulse rounded-3xl"></div>
            )}
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-dashed border-pink-300 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#f8bbd0] hover:bg-[#fff0f5] transition-all duration-300 relative overflow-hidden"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <div className="bg-[#fce4ec] p-5 rounded-full mb-4 group-hover:scale-110 group-hover:bg-[#f8bbd0] group-hover:text-white transition-all duration-300 shadow-sm" style={{ color: '#f8bbd0' }}>
              <UploadCloud size={36} />
            </div>
            <h3 className="font-bold text-xl" style={{ color: '#f8bbd0' }}>อัปโหลดไฟล์งาน</h3>
            <p className="text-sm mt-2" style={{ color: '#f8bbd0' }}>คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางตรงนี้ได้เลย</p>
          </div>
        </div>

        {/* ฝั่งขวา: รายการตารางงาน */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border-2 border-pink-100 flex flex-col h-full relative">
          
          <div className="flex justify-between items-center mb-6 border-b-2 border-pink-50 pb-4">
            <div className="flex items-center gap-3">
              <img 
                src="/cat-cute.jpg" 
                alt="Cute Cat" 
                className="w-12 h-12 rounded-full object-cover border border-pink-200 shadow-xs hidden sm:block"
              />
              <div>
                <h2 className="text-2xl font-extrabold" style={{ color: '#f8bbd0' }}>รายการงาน</h2>
                <p className="text-sm mt-0.5 font-medium" style={{ color: '#f8bbd0' }}>
                  ประจำวันที่ {date instanceof Date ? date.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </p>
              </div>
            </div>
            <button 
              onClick={() => { setUploadedFile(null); setFileObjectUrl(null); setIsModalOpen(true); }}
              className="bg-[#f472b6] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#d81b60] shadow-md shadow-pink-200 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2 shrink-0"
            >
              <Plus size={18} strokeWidth={3} /> เพิ่มงาน
            </button>
          </div>
          
          <div className="space-y-4 flex-1">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 font-medium" style={{ color: '#f8bbd0' }}>ไม่มีงานในวันนี้ พักผ่อนให้เต็มที่นะคะ 🌸</div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all group ${task.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-[#fff0f5] border-pink-100 hover:shadow-md'}`}>
                  
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`mt-1 transition-colors group-hover:scale-110 ${task.completed ? 'text-[#f472b6]' : 'hover:text-[#d81b60]'}`}
                    style={{ color: '#f8bbd0' }}
                  >
                    <CheckCircle2 size={26} fill={task.completed ? '#fce4ec' : 'none'} />
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${task.completed ? 'text-gray-400 line-through' : ''}`} style={{ color: '#f8bbd0' }}>
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${task.completed ? 'text-gray-400 bg-gray-100' : 'bg-pink-100'}`} style={{ color: '#f8bbd0' }}>
                        <Clock size={14} /> {task.time} น.
                      </span>
                      {task.fileName && (
                        <div className="flex items-center gap-1">
                          <FileText size={14} className={task.completed ? 'text-gray-400' : ''} style={{ color: '#f8bbd0' }} />
                          {task.fileUrl ? (
                            <a 
                              href={task.fileUrl} 
                              download={task.fileName}
                              className={`text-sm font-medium underline flex items-center gap-1 hover:text-[#d81b60] ${task.completed ? 'text-gray-400' : ''}`}
                              style={{ color: '#f8bbd0' }}
                              title="คลิกเพื่อดาวน์โหลดไฟล์"
                            >
                              {task.fileName} <Download size={13} />
                            </a>
                          ) : (
                            <span className={`text-sm font-medium ${task.completed ? 'text-gray-400' : ''}`} style={{ color: '#f8bbd0' }}>
                              {task.fileName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="hover:text-red-400 hover:bg-red-50 p-2 rounded-full transition-all mt-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    style={{ color: '#f8bbd0' }}
                    title="ลบงานนี้"
                  >
                    <Trash2 size={22} />
                  </button>

                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ป๊อปอัปเพิ่มงาน / แนบไฟล์ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-900/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border-2 border-pink-100 animate-fade-in relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 bg-pink-50 rounded-full p-1 transition-colors" style={{ color: '#f8bbd0' }}>
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: '#f8bbd0' }}>
              <Plus size={24} style={{ color: '#f8bbd0' }}/> เพิ่มงานใหม่
            </h2>
            <p className="text-xs mb-6" style={{ color: '#f8bbd0' }}>สำหรับวันที่: {date instanceof Date ? date.toLocaleDateString('th-TH') : ''}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: '#f8bbd0' }}>ชื่องาน / รายละเอียด</label>
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="เช่น ส่งโปรเจกต์วิชา..."
                  className="w-full border-2 border-pink-100 rounded-2xl px-4 py-3 outline-none focus:border-[#f472b6] focus:bg-pink-50 text-gray-700 transition-colors"
                />
              </div>
              
              {uploadedFile && (
                <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200 flex items-center justify-between text-sm" style={{ color: '#f8bbd0' }}>
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={16} />
                    <span className="truncate">ไฟล์: <b>{uploadedFile.name}</b></span>
                  </div>
                  <span className="text-xs bg-pink-200 px-2 py-0.5 rounded-full font-bold" style={{ color: '#d81b60' }}>พร้อมบันทึก</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-1" style={{ color: '#f8bbd0' }}>เวลาที่ต้องทำ</label>
                <input 
                  type="time" 
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="w-full border-2 border-pink-100 rounded-2xl px-4 py-3 outline-none focus:border-[#f472b6] focus:bg-pink-50 text-gray-700 transition-colors"
                />
              </div>
              
              <button 
                onClick={handleAddTask}
                className="w-full bg-[#f472b6] text-white font-bold text-lg rounded-2xl py-3 mt-4 shadow-md hover:bg-[#d81b60] hover:shadow-lg transition-all"
              >
                บันทึกงาน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}