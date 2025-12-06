import { useMemo, useState } from "react";
import { ladderLevels, LadderLevel } from "../data/sampleData";
import { useAuthGuard } from "../hooks/useAuthGuard";

const teacherUnlockCodes: Record<string, number> = {
  "KANA-LEVEL-3": 3,
  "KANA-LEVEL-4": 4,
  "KANA-LEVEL-5": 5,
  "KANA-PRO-6": 6,
};

const LadderPage = () => {
  const { user, initializing } = useAuthGuard();
  const [selectedLevel, setSelectedLevel] = useState<LadderLevel>(ladderLevels[0]);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [teacherCode, setTeacherCode] = useState("KANA-LEVEL-3");
  const [questionText, setQuestionText] = useState("老师好，想问 Level 2 的作业要求？");
  const [analysisLog, setAnalysisLog] = useState<string[]>(["已进入 LEVEL 1 梯度学习"]);
  const [readingState, setReadingState] = useState<Record<number, { answer: number | null; submitted: boolean }>>({});
  const [listeningState, setListeningState] = useState<Record<number, { answer: number | null; submitted: boolean }>>({});

  if (!user && !initializing) {
    return null;
  }

  const appendLog = (entry: string) => {
    setAnalysisLog((prev) => [entry, ...prev].slice(0, 8));
  };

  const handleLevelSelect = (levelItem: LadderLevel) => {
    if (levelItem.level > unlockedLevel) {
      setStatusMessage(`当前仅解锁至 LEVEL ${unlockedLevel}，请先完成等级测试或输入教师口令。`);
      return;
    }
    setSelectedLevel(levelItem);
    setStatusMessage(null);
    appendLog(`切换到 LEVEL ${levelItem.level} · ${levelItem.title}`);
  };

  const handleSimulatedTest = () => {
    const simulatedLevel = Math.ceil(Math.random() * ladderLevels.length);
    const nextLevel = Math.max(unlockedLevel, simulatedLevel);
    setUnlockedLevel(nextLevel);
    setStatusMessage(`模拟测试判定可直接进入 LEVEL ${simulatedLevel}，已解锁到 LEVEL ${nextLevel}。`);
    appendLog(`模拟测试 -> 解锁到 LEVEL ${nextLevel}`);
  };

  const handleTeacherUnlock = () => {
    const normalized = teacherCode.trim().toUpperCase();
    if (!normalized) {
      setStatusMessage("请输入教师口令");
      return;
    }
    const target = teacherUnlockCodes[normalized];
    if (!target) {
      setStatusMessage("口令无效，请向老师确认后再输入。");
      return;
    }
    setUnlockedLevel((prev) => Math.max(prev, target));
    setStatusMessage(`已通过口令解锁至 LEVEL ${target}`);
    appendLog(`使用教师口令，跳转到 LEVEL ${target}`);
    setTeacherCode("");
  };

  const handleResetProgress = () => {
    if (!window.confirm("确认要清空学习进度吗？")) return;
    if (!window.confirm("请再次确认：清空后需要从 LEVEL 1 重新开始。")) return;
    setUnlockedLevel(1);
    setSelectedLevel(ladderLevels[0]);
    setReadingState({});
    setListeningState({});
    setStatusMessage("已清空至 LEVEL 1，请重新开始梯度学习。");
    appendLog("已重置学习进度");
  };

  const readingStatus = readingState[selectedLevel.level] ?? { answer: null, submitted: false };
  const listeningStatus = listeningState[selectedLevel.level] ?? { answer: null, submitted: false };

  const handleReadingAnswer = (optionIndex: number) => {
    setReadingState((prev) => ({
      ...prev,
      [selectedLevel.level]: { answer: optionIndex, submitted: false },
    }));
  };

  const handleListeningAnswer = (optionIndex: number) => {
    setListeningState((prev) => ({
      ...prev,
      [selectedLevel.level]: { answer: optionIndex, submitted: false },
    }));
  };

  const handleReadingSubmit = () => {
    if (readingStatus.answer === null) {
      setStatusMessage("请先选择一个阅读理解答案");
      return;
    }
    setReadingState((prev) => ({
      ...prev,
      [selectedLevel.level]: { answer: readingStatus.answer, submitted: true },
    }));
    const isCorrect = readingStatus.answer === selectedLevel.readingQuestion.answerIndex;
    setStatusMessage(isCorrect ? "阅读题正确" : "阅读题暂未通过，可查看解析继续练习");
    appendLog(`LEVEL ${selectedLevel.level} 阅读题 ${isCorrect ? "正确" : "需要复习"}`);
  };

  const handleListeningSubmit = () => {
    if (listeningStatus.answer === null) {
      setStatusMessage("请先完成听力题");
      return;
    }
    setListeningState((prev) => ({
      ...prev,
      [selectedLevel.level]: { answer: listeningStatus.answer, submitted: true },
    }));
    const isCorrect = listeningStatus.answer === selectedLevel.listeningQuestion.answerIndex;
    setStatusMessage(isCorrect ? "听力题作答正确" : "听力题需重新听一遍音频");
    appendLog(`LEVEL ${selectedLevel.level} 听力题 ${isCorrect ? "正确" : "错误"}`);
  };

  const keyFocus = useMemo(() => selectedLevel.keyFocus.join(" · "), [selectedLevel]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">梯度学习中心</h1>
        <p className="text-slate-500 text-sm">
          6 个等级循序渐进，默认从 LEVEL 1 开始。完成等级测试或输入教师口令即可解锁更高章节，可随时播放录播、阅读 PPT、练习阅读/听力题。
        </p>
      </div>

      {statusMessage && (
        <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-2 rounded-md text-sm">
          {statusMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-5">
        <aside className="space-y-4">
          <div className="bg-white border rounded-xl p-4 space-y-2">
            <p className="font-semibold">等级导航</p>
            <p className="text-xs text-slate-500">已解锁至 LEVEL {unlockedLevel}</p>
            <div className="space-y-2">
              {ladderLevels.map((levelItem) => (
                <button
                  key={levelItem.level}
                  onClick={() => handleLevelSelect(levelItem)}
                  className={`w-full text-left border rounded-md px-3 py-2 text-sm transition ${
                    selectedLevel.level === levelItem.level
                      ? "border-primary bg-primary/10"
                      : "border-slate-200"
                  } ${levelItem.level > unlockedLevel ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <span className="font-semibold">LEVEL {levelItem.level}</span>
                  <p className="text-xs text-slate-500">{levelItem.title}</p>
                  {levelItem.level > unlockedLevel && (
                    <span className="text-[10px] text-rose-500">已锁定</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4 space-y-3">
            <p className="font-semibold">等级测试 & 口令</p>
            <p className="text-xs text-slate-500">
              点击下方按钮进行“模拟等级测试”，系统会随机返回可解锁的最高等级。
            </p>
            <button
              onClick={handleSimulatedTest}
              className="w-full rounded-md bg-secondary text-white py-2 text-sm"
            >
              模拟等级测试
            </button>
            <div className="space-y-1 text-sm">
              <label className="text-xs text-slate-500">教师口令</label>
              <div className="flex gap-2">
                <input
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  className="flex-1 border rounded-md px-2 py-1"
                />
                <button
                  onClick={handleTeacherUnlock}
                  type="button"
                  className="px-3 py-1 bg-primary text-white rounded-md text-sm"
                >
                  解锁
                </button>
              </div>
              <p className="text-[11px] text-slate-400">示例：KANA-LEVEL-5、KANA-PRO-6</p>
            </div>
            <button
              onClick={handleResetProgress}
              className="w-full border border-rose-200 text-rose-500 rounded-md py-2 text-sm"
            >
              一键忘记学习进度
            </button>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="font-semibold text-sm">学习记录</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-500">
              {analysisLog.map((log, index) => (
                <li key={`${log}-${index}`}>• {log}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border rounded-xl p-5 space-y-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-slate-500">当前等级</p>
              <h2 className="text-xl font-semibold">
                LEVEL {selectedLevel.level} · {selectedLevel.title}
              </h2>
              <p className="text-sm text-slate-600">{selectedLevel.summary}</p>
              <p className="text-xs text-slate-500">重点：{keyFocus}</p>
              <p className="text-xs text-slate-500">建议学习时长：{selectedLevel.recommendedMinutes} 分钟</p>
            </div>
            <video controls className="w-full rounded-lg border">
              <source src={selectedLevel.videoUrl} type="video/mp4" />
            </video>
            <div className="border rounded-lg p-4 relative">
              <div className="absolute top-2 right-3 text-[11px] uppercase tracking-wide text-rose-500">
                禁止截图
              </div>
              <p className="font-semibold text-sm">PPT 精华页</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
                {selectedLevel.pptSlides.map((slide) => (
                  <li key={slide}>{slide}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <p className="font-semibold">阅读理解练习</p>
              <p className="text-xs text-slate-500">仿照高考英语模式完成单项选择。</p>
              <p className="text-sm font-medium">{selectedLevel.readingQuestion.question}</p>
              <div className="space-y-2">
                {selectedLevel.readingQuestion.options.map((option, index) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 border rounded-md px-3 py-2 text-sm ${
                      readingStatus.answer === index ? "border-primary" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`reading-${selectedLevel.level}`}
                      checked={readingStatus.answer === index}
                      onChange={() => handleReadingAnswer(index)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleReadingSubmit}
                className="mt-2 w-full bg-primary text-white rounded-md py-2 text-sm"
              >
                提交阅读答案
              </button>
              {readingStatus.submitted && (
                <p
                  className={`text-sm ${
                    readingStatus.answer === selectedLevel.readingQuestion.answerIndex
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {readingStatus.answer === selectedLevel.readingQuestion.answerIndex
                    ? "回答正确！"
                    : `正确答案：${selectedLevel.readingQuestion.options[selectedLevel.readingQuestion.answerIndex]}。${selectedLevel.readingQuestion.explanation}`}
                </p>
              )}
            </div>

            <div className="bg-white border rounded-xl p-4 space-y-3">
              <p className="font-semibold">听力测验</p>
              <audio controls className="w-full">
                <source src={selectedLevel.listeningQuestion.audioUrl} />
              </audio>
              <p className="text-sm">{selectedLevel.listeningQuestion.prompt}</p>
              <div className="space-y-2">
                {selectedLevel.listeningQuestion.options.map((option, index) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 border rounded-md px-3 py-2 text-sm ${
                      listeningStatus.answer === index ? "border-secondary" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`listening-${selectedLevel.level}`}
                      checked={listeningStatus.answer === index}
                      onChange={() => handleListeningAnswer(index)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleListeningSubmit}
                  className="flex-1 bg-secondary text-white rounded-md py-2 text-sm"
                >
                  提交听力答案
                </button>
                <button
                  onClick={() => appendLog(`重新播放 LEVEL ${selectedLevel.level} 听力音轨`)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  再听一遍
                </button>
              </div>
              {listeningStatus.submitted && (
                <p
                  className={`text-sm ${
                    listeningStatus.answer === selectedLevel.listeningQuestion.answerIndex
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {listeningStatus.answer === selectedLevel.listeningQuestion.answerIndex
                    ? "听力答案正确"
                    : `答案应为：${selectedLevel.listeningQuestion.options[selectedLevel.listeningQuestion.answerIndex]}；${selectedLevel.listeningQuestion.explanation}`}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4 space-y-3">
            <p className="font-semibold">互动问答 / 学习反馈</p>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={4}
              className="w-full border rounded-md p-3 text-sm"
              placeholder="输入要提问老师的问题..."
            />
            <div className="flex gap-3">
              <button className="flex-1 bg-slate-900 text-white rounded-md py-2 text-sm" disabled>
                提交问题（实时互动即将上线）
              </button>
              <button
                onClick={() => appendLog(`记录问题：“${questionText.slice(0, 12)}...”`)}
                className="px-4 py-2 border rounded-md text-sm"
              >
                记录问题
              </button>
            </div>
            <p className="text-xs text-slate-500">
              提示：实时问答与作业点评将接入 AI 学习助手与老师联合判分。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LadderPage;
