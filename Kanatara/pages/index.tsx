import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const modules = [
  { title: "梯度学习", description: "达人课程与实时问答", href: "/ladder", icon: "📚" },
  { title: "真题练习", description: "TOPIK 选择题 + 作文反馈", href: "/exam", icon: "✏️" },
  { title: "词汇学习", description: "单词卡 & 复习计划", href: "/vocab", icon: "🔤" },
  { title: "视频模块", description: "影视赏析 + 发音评估", href: "/video", icon: "🎬" },
  { title: "社区任务", description: "每日任务与积分系统", href: "/tasks", icon: "⭐" },
  { title: "用户中心", description: "资料、积分、邀请码", href: "/user", icon: "👤" },
  { title: "AI 学习助手", description: "六种模式的智能助手", href: "/assistant", icon: "🤖" },
];

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* --- Hero Section: 左文右图 --- */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* 左侧：文字内容 */}
          <div className={`flex-1 space-y-6 text-left transition-all duration-700 ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                韩语学习实验站
              </h1>
              <p className="text-2xl md:text-3xl font-medium text-slate-600 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                한국어 학습 실습장
              </p>
            </div>
            
            <p className="text-slate-600 text-base leading-relaxed max-w-lg">
              全方位韩语学习平台，集梯度课程、真题练习、词汇积累、视频精赏、社区任务与 AI 助手为一体，助力你快速提升韩语水平。
            </p>

            {/* 按钮组 */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/exam"
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 hover:shadow-lg transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:scale-95"
              >
                开始练习
              </Link>
              <Link
                href="/user"
                className="px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 hover:border-primary/50 hover:shadow-md transition-all duration-300 shadow-sm active:scale-95"
              >
                个人中心
              </Link>
            </div>
          </div>

          {/* 右侧：圆圈插画区域 */}
          <div className={`flex-1 relative w-full h-[350px] md:h-[400px] hidden lg:block transition-all duration-700 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="relative w-full h-full">
              
              {/* 中间的大圆 (Main) */}
              <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-primary/10 rounded-full flex items-center justify-center z-10 shadow-lg overflow-hidden border-2 border-primary/20 animate-center-float card-shine">
                <Image 
                  src="/images/11.png" 
                  alt="Kanatara Logo" 
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>

              {/* 装饰圆圈 - 各自有延迟的浮动动画 */}
              <div className="absolute top-[10%] left-[8%] w-20 h-20 bg-primary/5 rounded-full shadow-sm border border-primary/10 animate-float" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-[8%] right-[15%] w-16 h-16 bg-secondary/10 rounded-full shadow-sm border border-secondary/10 animate-float" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute top-[35%] right-[2%] w-24 h-24 bg-primary/5 rounded-full shadow-sm border border-primary/10 animate-float" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute bottom-[12%] right-[18%] w-20 h-20 bg-secondary/5 rounded-full shadow-sm border border-secondary/10 animate-float" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute bottom-[18%] left-[15%] w-14 h-14 bg-primary/5 rounded-full shadow-sm border border-primary/10 animate-float" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </section>

        {/* --- Modules Grid: 学习模块 --- */}
        <section>
          <div className={`mb-8 transition-all duration-700 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-slate-900">开始学习</h2>
            <p className="text-slate-600 text-sm mt-1">选择合适的学习方式，开启你的韩语学习之旅</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <Link
                key={module.href}
                href={module.href}
              >
                <div 
                  className={`group h-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer card-shine ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.5 + index * 0.08}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl group-hover:animate-bounce-gentle transition-transform">{module.icon}</span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">→</span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-primary transition-colors duration-300">
                    {module.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- Features Section --- */}
        <section 
          className={`bg-white rounded-xl border border-slate-200 p-8 md:p-12 transition-all duration-700 card-shine ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.9s' }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "100+", label: "真题资源", desc: "汇集多年 TOPIK 考试题目与音频" },
              { number: "AI 驱动", label: "智能反馈", desc: "六种学习模式，个性化学习体验" },
              { number: "社区", label: "每日任务", desc: "积分系统激励，与伙伴共同进步" },
            ].map((feature, index) => (
              <div key={index} className="space-y-2 group">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.number}
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors duration-300">
                  {feature.label}
                </h3>
                <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default HomePage;
