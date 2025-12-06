import { useState, useEffect, useRef } from "react";
// 请根据实际路径保留这两个引用
import { useAuthGuard } from "../hooks/useAuthGuard";
import { videoList } from "../data/videoData";

/**
 * 🎨 设计规范更新:
 * - 字体: 针对韩语优化行高 (leading-loose)
 * - 交互: 增加 hover 反馈，优化移动端触控区域
 * - 颜色: 沿用 Tailwind 语义化颜色，增加 Glassmorphism (毛玻璃) 效果
 */

// --- 工具函数 ---
const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// --- 组件：TTS 朗读按钮 (UI 微调) ---
const TTSButton = ({ htmlText }: { htmlText: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getCleanText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = getCleanText(htmlText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ko-KR";
    utterance.rate = 0.95; // 稍微调慢一点点，更适合精听
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <button
      onClick={handleSpeak}
      className={`
        group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
        ${isPlaying 
          ? "bg-blue-100 text-blue-600 ring-2 ring-blue-200 scale-110" 
          : "bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 hover:scale-105"
        }
      `}
      title={isPlaying ? "停止朗读" : "朗读韩语"}
    >
      {isPlaying ? (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 2.75 2.75 0 010-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      )}
    </button>
  );
};

// --- 主页面组件 ---
const VideoPage = () => {
  const { user, initializing } = useAuthGuard();
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  
  // 步骤与解锁
  const [step, setStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);

  // 状态
  const [readProgress, setReadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  if (!user && !initializing) return null;

  // --- 视频控制 ---
  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) setVideoTime(videoRef.current.currentTime);
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) setVideoDuration(videoRef.current.duration);
  };

  const handleVideoSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setVideoTime(time);
    }
  };

  // --- 滚动监听 ---
  const handleScroll = (e: any) => {
    const target = e.target as HTMLElement;
    if (target.scrollHeight - target.clientHeight <= 0) {
      setReadProgress(100);
      return;
    }
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setReadProgress(Math.min(100, Math.max(0, progress)));
  };

  useEffect(() => {
    const handleWindowScroll = () => {
      if (step === 2 && window.innerWidth < 1024) { 
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            setReadProgress(Math.min(100, Math.max(0, progress)));
        }
      }
    };
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [step]);

  // 重置状态
  useEffect(() => {
    setIsVideoPlaying(false);
    setVideoTime(0);
    setVideoDuration(0);
    setReadProgress(0);
  }, [currentDay, step]);

  // ==========================
  // 视图 1: 视频选集 (Gallery View) - 美化版
  // ==========================
  if (currentDay === null) {
    return (
      <section className="max-w-7xl mx-auto p-6 md:p-10 min-h-screen bg-slate-50/50">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            韩语综艺精听 <span className="text-blue-600">21天</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg">每天一个片段，沉浸式掌握地道表达。</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videoList.map((video) => (
            <div
              key={video.day}
              onClick={() => { 
                  setCurrentDay(video.day); 
                  setStep(1); 
                  setMaxUnlockedStep(1); 
                  setReadProgress(0); 
              }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col border border-slate-100"
            >
              {/* 封面图区域 */}
              <div className="relative aspect-video bg-slate-200 overflow-hidden">
                 {video.cover ? (
                  <img src={video.cover} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <span className="text-4xl font-black text-blue-200/50">DAY</span>
                    <span className="text-5xl font-black text-blue-600">{video.day}</span>
                  </div>
                )}
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* 播放按钮 (悬浮) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                   <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-2xl">
                     <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
              </div>

              {/* 信息区域 */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Day {video.day}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                </h3>
                
                {/* 底部栏修改：将Level移至右侧黄色方块 */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400 line-clamp-1">
                        点击开始今日学习
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-sm font-medium border border-yellow-200">
                        {video.level || "中级"}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const videoData = videoList.find(v => v.day === currentDay) || videoList[0];

  // ==========================
  // 视图 2: 学习详情页
  // ==========================
  return (
    <section className="max-w-screen-2xl mx-auto h-screen flex flex-col bg-white md:bg-slate-50/30 overflow-hidden">
      
      {/* --- 顶部导航栏 --- */}
      <header className="flex-shrink-0 h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4 overflow-hidden">
            <button 
                onClick={() => setCurrentDay(null)} 
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="返回列表"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>
            <div className="flex flex-col">
                <h1 className="text-base font-bold text-slate-800 line-clamp-1">{videoData.title}</h1>
                <span className="text-xs text-slate-400">Day {currentDay} • {step === 1 ? "泛听阶段" : "精听阶段"}</span>
            </div>
        </div>

        {/* 步骤切换器 */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
            {[1, 2].map((s) => (
                <button
                    key={s}
                    disabled={s === 2 && maxUnlockedStep < 2}
                    onClick={() => { if (s === 1 || maxUnlockedStep >= 2) setStep(s); }}
                    className={`
                        relative px-4 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-all duration-300
                        ${step === s 
                            ? "bg-white text-blue-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        }
                        ${s === 2 && maxUnlockedStep < 2 ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    {s === 1 ? "1. 完整视频" : (
                        <span className="flex items-center gap-1">
                             {maxUnlockedStep < 2 && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-7h-1V7c0-1.1-.9-2-2-2S10 5.9 10 7v1H9c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2z"/></svg>}
                             2. 精听 & 精读
                        </span>
                    )}
                </button>
            ))}
        </div>
      </header>

      {/* --- 内容主体 --- */}
      <main className="flex-1 min-h-0 relative overflow-hidden">
        
        {/* =========== Step 1: 泛听模式 =========== */}
        {step === 1 && (
          <div className="h-full overflow-y-auto p-4 lg:p-10 flex flex-col items-center animate-fadeIn">
            <div className="w-full max-w-5xl flex flex-col gap-6">
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video ring-1 ring-slate-900/5 relative group">
                      <video controls className="w-full h-full object-contain" key={videoData.fullVideo}>
                         <source src={videoData.fullVideo} type="video/mp4" />
                      </video>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">任务目标</h3>
                    <p className="text-slate-500 mb-6">请先不看字幕完整观看一遍视频，尝试理解大概内容。</p>
                    <button
                        onClick={() => { setMaxUnlockedStep(2); setStep(2); }}
                        className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-200 hover:scale-105 active:scale-95"
                    >
                        挑战完成，开始精析 →
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* =========== Step 2: 精听模式 (分栏布局) =========== */}
        {step === 2 && (
          <div className="flex flex-col lg:flex-row h-full">
            
            {/* --- 左侧 (Mobile: 顶部) 视频悬浮区 --- */}
            <div className="lg:w-[45%] xl:w-[40%] shrink-0 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-slate-200 z-30 shadow-md lg:shadow-none">
               
               {/* 视频播放器容器 */}
               <div className="relative bg-black aspect-video w-full lg:h-auto lg:aspect-video">
                   <video 
                       ref={videoRef}
                       playsInline 
                       className="w-full h-full object-contain" 
                       key={videoData.segment}
                       onTimeUpdate={handleVideoTimeUpdate}
                       onLoadedMetadata={handleVideoLoadedMetadata}
                       onEnded={() => setIsVideoPlaying(false)}
                   >
                       <source src={videoData.segment} type="video/mp4" />
                   </video>

                   {/* 遮罩层 Play 按钮 */}
                   <div 
                       className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                       onClick={toggleVideoPlay}
                   >
                       {!isVideoPlaying && (
                           <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-white/30 transition-transform group-hover:scale-110">
                               <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                           </div>
                       )}
                   </div>
               </div>

               {/* 自定义控制面板 */}
               <div className="p-4 lg:p-6 bg-white space-y-4">
                   {/* 进度滑块 */}
                   <div className="relative h-2 w-full group">
                       <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600/20 w-full"></div>
                       </div>
                       <input 
                           type="range" 
                           min="0" 
                           max={videoDuration || 100} 
                           step="0.1"
                           value={videoTime} 
                           onChange={handleVideoSeek}
                           className="absolute -top-1.5 left-0 w-full h-4 opacity-0 cursor-pointer z-20"
                       />
                       <div 
                           className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full pointer-events-none transition-all duration-100"
                           style={{ width: `${(videoTime / (videoDuration || 1)) * 100}%` }}
                       />
                       <div 
                           className="absolute top-[-4px] w-3 h-3 bg-white border-2 border-blue-600 rounded-full shadow-md pointer-events-none transition-all duration-100 scale-0 group-hover:scale-100"
                           style={{ left: `${(videoTime / (videoDuration || 1)) * 100}%`, transform: `translateX(-50%) scale(1)` }}
                       />
                   </div>

                   {/* 控制按钮组 */}
                   <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                           <button onClick={toggleVideoPlay} className="text-slate-700 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50">
                               {isVideoPlaying ? (
                                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                               ) : (
                                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                               )}
                           </button>
                           <div className="text-sm font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                               {formatTime(videoTime)} <span className="text-slate-300 mx-1">/</span> {formatTime(videoDuration)}
                           </div>
                       </div>
                       
                       {/* 阅读进度指示器 */}
                       <div className="flex flex-col items-end">
                           <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Study Progress</span>
                           <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                   className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                                   style={{ width: `${readProgress}%` }}
                               ></div>
                           </div>
                       </div>
                   </div>
               </div>
            </div>

            {/* --- 右侧 (Mobile: 下方) 文本滚动区 --- */}
            <div 
                ref={desktopScrollRef}
                onScroll={handleScroll}
                className="flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 lg:p-8 pb-24"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                {videoData.sentences.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                  >
                    {/* 头部: 序号与TTS */}
                    <div className="flex items-start justify-between mb-4">
                        <span className="font-mono text-slate-200 text-3xl font-bold select-none leading-none">{(idx + 1).toString().padStart(2, '0')}</span>
                        <TTSButton htmlText={s.korean} />
                    </div>

                    {/* 韩语原句 */}
                    <div className="mb-5">
                        <div 
                            className="text-xl md:text-2xl leading-loose tracking-wide text-slate-800 font-medium break-keep"
                            // 这里的类名 (text-blue-600 等) 依赖于 tailwind 是否 safelist 或者 JIT 扫描到。
                            // 确保 HTML 字符串里的 class 是标准的 Tailwind 类
                            dangerouslySetInnerHTML={{ __html: s.korean }} 
                        />
                    </div>

                    {/* 中文翻译 */}
                    <div 
                        className="text-slate-500 text-base md:text-lg leading-relaxed border-l-4 border-blue-100 pl-4 mb-6"
                        dangerouslySetInnerHTML={{ __html: s.chinese }}
                    />

                    {/* 知识点区域 */}
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        {/* 单词 */}
                        {s.words.length > 0 && (
                             <div className="flex flex-wrap gap-2">
                                {s.words.map((w, i) => (
                                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                        {w}
                                    </span>
                                ))}
                             </div>
                        )}
                        
                        {/* 笔记 */}
                        {s.note && (
                            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-7">
                                <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold text-xs uppercase">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Learning Note
                                </div>
                                <div 
                                  className="prose prose-sm prose-blue max-w-none [&_strong]:text-slate-800 [&_ul]:pl-4 [&_li]:marker:text-blue-300"
                                  dangerouslySetInnerHTML={{ __html: s.note }}
                                />
                            </div>
                        )}
                    </div>
                  </div>
                ))}
                <div className="h-20 lg:h-10 flex items-center justify-center text-slate-300 text-sm">
                   — End of Lesson —
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- 底部切换栏 (Sticky Bottom) --- */}
      <footer className="flex-shrink-0 border-t border-slate-200 bg-white/90 backdrop-blur lg:static fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
         <div className="max-w-screen-2xl mx-auto px-4 py-3 flex justify-between items-center">
             <button
                disabled={!videoList.find(v => v.day === (currentDay || 0) - 1)}
                onClick={() => { 
                    const prev = (currentDay || 0) - 1;
                    if (videoList.find(v => v.day === prev)) {
                        setCurrentDay(prev); setStep(1); setMaxUnlockedStep(1); setReadProgress(0);
                    }
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-medium text-sm"
             >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 <span className="hidden md:inline">上一天</span>
             </button>

             <div className="flex items-center gap-1">
                 <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Day {currentDay}</span>
             </div>

             <button
                disabled={!videoList.find(v => v.day === (currentDay || 0) + 1)}
                onClick={() => { 
                    const next = (currentDay || 0) + 1;
                    if (videoList.find(v => v.day === next)) {
                        setCurrentDay(next); setStep(1); setMaxUnlockedStep(1); setReadProgress(0);
                    }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-200 font-medium text-sm"
             >
                 <span className="hidden md:inline">下一天</span>
                 <span className="md:hidden">Next</span>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
         </div>
      </footer>
    </section>
  );
};

export default VideoPage;