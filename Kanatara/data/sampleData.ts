export interface McqQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LadderListeningQuestion {
  id: number;
  audioUrl: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LadderLevel {
  level: number;
  title: string;
  summary: string;
  videoUrl: string;
  pptSlides: string[];
  readingQuestion: McqQuestion;
  listeningQuestion: LadderListeningQuestion;
  keyFocus: string[];
  recommendedMinutes: number;
}

export const ladderLevels: LadderLevel[] = [
  {
    level: 1,
    title: "LEVEL 1 · 基础发音",
    summary: "掌握40音与基础收音发音，建立梯度学习第一步。",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pptSlides: ["双元音与三元音组合", "收音的发声位置", "节奏跟读练习"],
    readingQuestion: {
      id: 101,
      question: "以下哪句在自我介绍中最自然？",
      options: ["안녕하세요. 저는 민지예요.", "안녕하세요. 밥을 먹어요.", "사과가 맛있어요.", "학교가 멀어요."],
      answerIndex: 0,
      explanation: "自我介绍应该包含名字。",
    },
    listeningQuestion: {
      id: 201,
      audioUrl: "https://www.w3schools.com/html/horse.mp3",
      prompt: "听音后选择正确问候语。",
      options: ["안녕하세요?", "안녕히 가세요.", "감사합니다.", "죄송합니다."],
      answerIndex: 0,
      explanation: "录音为见面问候。",
    },
    keyFocus: ["区分松音与紧音", "基本问候表达"],
    recommendedMinutes: 40,
  },
  {
    level: 2,
    title: "LEVEL 2 · 初级句型",
    summary: "进入简单陈述句与疑问句，扩展课堂交流。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    pptSlides: ["-이에요/예요 判断句", "-습니까? 疑问形式", "课堂指令表达"],
    readingQuestion: {
      id: 102,
      question: "选择与“我在图书馆学习”意义相同的句子。",
      options: ["도서관에서 공부해요.", "도서관이 커요.", "학교에 가요.", "공원에서 달려요."],
      answerIndex: 0,
      explanation: "动词 + 에서 表示在某地进行某动作。",
    },
    listeningQuestion: {
      id: 202,
      audioUrl: "https://www.w3schools.com/html/horse.mp3",
      prompt: "录音中出现的地点是哪里？",
      options: ["학교", "공원", "병원", "도서관"],
      answerIndex: 3,
      explanation: "音频提到도서관。",
    },
    keyFocus: ["场所助词", "基本疑问句"],
    recommendedMinutes: 45,
  },
  {
    level: 3,
    title: "LEVEL 3 · 中级语法",
    summary: "掌握连接词与叙述时态，开始讨论经历。",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    pptSlides: ["-지만 让步", "-았/었- 过去式", "关联词练习"],
    readingQuestion: {
      id: 103,
      question: "“虽然累但是很开心”对应句子是？",
      options: ["피곤하지만 즐거워요.", "바쁘지만 먹어요.", "더워서 즐거워요.", "춥지만 더워요."],
      answerIndex: 0,
      explanation: "-지만 表示让步：虽然...但是...",
    },
    listeningQuestion: {
      id: 203,
      audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      prompt: "听录音判断说话者想做什么。",
      options: ["旅行", "睡觉", "学习韩文", "做饭"],
      answerIndex: 2,
      explanation: "音频提及한국어를 공부하고 싶어요.",
    },
    keyFocus: ["让步句", "过去式"],
    recommendedMinutes: 50,
  },
  {
    level: 4,
    title: "LEVEL 4 · 高级表达",
    summary: "聚焦书面表达，掌握复杂句。",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    pptSlides: ["-(으)므로 原因表达", "-도록 目的", "书面语语尾"],
    readingQuestion: {
      id: 104,
      question: "哪句表达“为了准备考试正在熬夜”？",
      options: ["시험을 준비하도록 밤새워요.", "시험이 없어요.", "시험이 끝났어요.", "시험을 보지 않아요."],
      answerIndex: 0,
      explanation: "-도록 表目的。",
    },
    listeningQuestion: {
      id: 204,
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
      prompt: "音频提到的计划是什么？",
      options: ["海外实习", "音乐会", "商务会议", "毕业旅行"],
      answerIndex: 2,
      explanation: "录音里提到회의。",
    },
    keyFocus: ["书面语", "目的表达"],
    recommendedMinutes: 55,
  },
  {
    level: 5,
    title: "LEVEL 5 · 实战演练",
    summary: "结合听说读写，模拟真实商务场景。",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    pptSlides: ["商务电话用语", "演示结构", "汇报表达"],
    readingQuestion: {
      id: 105,
      question: "在商务语境下表达“请尽快回复”应选？",
      options: ["빠른 회신 부탁드립니다.", "빨리 먹겠습니다.", "회신이 필요 없어요.", "잠시만 기다려 주세요."],
      answerIndex: 0,
      explanation: "标准商务邮件语。",
    },
    listeningQuestion: {
      id: 205,
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
      prompt: "对话中的关键问题是？",
      options: ["交付延期", "机票问题", "酒店预订", "课程安排"],
      answerIndex: 0,
      explanation: "音频提到납품 일정。",
    },
    keyFocus: ["商务邮件", "会议表达"],
    recommendedMinutes: 60,
  },
  {
    level: 6,
    title: "LEVEL 6 · TOPIK 冲刺",
    summary: "高级论述、综合题型冲刺，配套AI问答。",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    pptSlides: ["议论文提纲", "图表描述", "AI 口语准备"],
    readingQuestion: {
      id: 106,
      question: "以下哪句更符合正式书面语？",
      options: ["이에 따라 대책을 마련하고자 합니다.", "그래서요, 그냥 했어요.", "몰라서 안 했어요.", "아무 생각이 없어요."],
      answerIndex: 0,
      explanation: "包含书面语词汇‘-고자 합니다’。",
    },
    listeningQuestion: {
      id: 206,
      audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
      prompt: "听短讲座判断主题。",
      options: ["韩国经济", "文化差异", "人工智能", "环保政策"],
      answerIndex: 2,
      explanation: "音频提到인공지능。",
    },
    keyFocus: ["议论文", "图表描述"],
    recommendedMinutes: 65,
  },
];

export interface TopikQuestionSet {
  id: string;
  title: string;
  type: "听力" | "写作";
  duration: string;
  year: string;
}

export const topikQuestionSets: TopikQuestionSet[] = [
  { id: "listening-2024a", title: "2024 TOPIK II 听力 A卷", type: "听力", duration: "60分钟", year: "2024" },
  { id: "listening-2023b", title: "2023 TOPIK I 听力 B卷", type: "听力", duration: "40分钟", year: "2023" },
  { id: "writing-2024", title: "2024 TOPIK II 写作", type: "写作", duration: "50分钟", year: "2024" },
];

export interface TopikListeningQuestion extends LadderListeningQuestion {
  difficulty: "初级" | "中级" | "高级";
  reference: string;
}

export const topikListeningQuestions: TopikListeningQuestion[] = [
  {
    id: 1,
    audioUrl: "https://www.w3schools.com/html/horse.mp3",
    prompt: "听对话，选择两人明天要做的事情。",
    options: ["参加音乐会", "去市场", "看电影", "上网课"],
    answerIndex: 3,
    explanation: "录音中提到在线课程。",
    difficulty: "初级",
    reference: "TOPIK I 2023-1",
  },
  {
    id: 2,
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav",
    prompt: "听新闻，选择正确的主要内容。",
    options: ["天气预报", "环保政策", "音乐节", "交通拥堵"],
    answerIndex: 1,
    explanation: "强调减少塑料使用。",
    difficulty: "中级",
    reference: "TOPIK II 2022-2",
  },
  {
    id: 3,
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
    prompt: "听讲座，推断教授的建议。",
    options: ["延长截止", "缩短考试", "增加作业", "取消报告"],
    answerIndex: 0,
    explanation: "教授提到给予更多时间。",
    difficulty: "高级",
    reference: "TOPIK II 2021-1",
  },
  {
    id: 4,
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
    prompt: "听商务电话，选择对方最关心的问题。",
    options: ["价格", "交期", "质量", "售后"],
    answerIndex: 1,
    explanation: "对方 repeatedly 提问什么时候交货。",
    difficulty: "高级",
    reference: "TOPIK II 模拟",
  },
];

export const topikReadingQuestions: McqQuestion[] = [
  {
    id: 11,
    question: "选择与画线词意思最接近的一项：학생들이 열정적으로 참여했다.",
    options: ["정성껏", "조용히", "억지로", "천천히"],
    answerIndex: 0,
    explanation: "열정적으로=充满热情地。",
  },
  {
    id: 12,
    question: "根据短文内容，作者最想强调的是？",
    options: ["环保的重要性", "旅行的意义", "工作的价值", "友情的可贵"],
    answerIndex: 0,
    explanation: "段落多次提到环境保护。",
  },
];

export interface TopikWritingTask {
  id: number;
  title: string;
  instructions: string;
  referenceYear: string;
  placeholder: string;
}

export const topikWritingTasks: TopikWritingTask[] = [
  {
    id: 301,
    title: "图表描述（留学生兼职比例）",
    instructions: "150~200字，描述图表趋势并提出看法。",
    referenceYear: "TOPIK II 2024",
    placeholder: "请描述图表，并分析原因与建议……",
  },
  {
    id: 302,
    title: "观点写作：线上学习是否有效",
    instructions: "200~250字，需包含个人经验和改进建议。",
    referenceYear: "TOPIK II 2023",
    placeholder: "提出观点-列举依据-总结……",
  },
];

export const essayPrompt = topikWritingTasks[0];

export interface VocabWord {
  id: number;
  word: string;
  translation: string;
  example: string;
  mastered: boolean;
  level: "初级" | "中级" | "高级";
}

export const vocabWords: VocabWord[] = [
  { id: 1, word: "안녕하세요", translation: "你好", example: "안녕하세요? 저는 민지예요.", mastered: true, level: "初级" },
  { id: 2, word: "감사하다", translation: "感谢", example: "도움에 감사해요.", mastered: false, level: "初级" },
  { id: 3, word: "도전", translation: "挑战", example: "새로운 도전을 시작했어요.", mastered: false, level: "中级" },
  { id: 4, word: "창의적", translation: "有创意的", example: "창의적인 아이디어가 필요해요.", mastered: false, level: "高级" },
];

export interface ReviewPlan {
  date: string;
  words: string[];
  tip: string;
}

export const reviewPlan: ReviewPlan = {
  date: new Date().toISOString(),
  words: ["감사하다", "도전", "창의적"],
  tip: "先跟读三遍，再尝试写出例句。",
};

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed?: boolean;
}

export const dailyTasks: DailyTask[] = [
  { id: "t1", title: "背 5 个新单词", description: "使用词汇模块完成", reward: 10 },
  { id: "t2", title: "完成 1 篇作文", description: "在真题模块提交写作", reward: 20 },
  { id: "t3", title: "跟读视频片段", description: "视频模块录音一次", reward: 15 },
];

export interface LeaderboardEntry {
  id: number;
  nickname: string;
  points: number;
}

export const leaderboard: LeaderboardEntry[] = [
  { id: 1, nickname: "어학달인", points: 280 },
  { id: 2, nickname: "SeoulRunner", points: 245 },
  { id: 3, nickname: "TOPIKHunter", points: 223 },
];

export const inviteCodePool = ["KANATARA-2025", "K-ALPHA-001", "HALLYU-CLUB"];
