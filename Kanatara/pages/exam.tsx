import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { listExamManifests, type AnswerKeyItem, type ExamManifest } from "../lib/exams";
import { useAuthGuard } from "../hooks/useAuthGuard";

type ClientExam = {
  id: string;
  title: string;
  pdfUrl: string | null;
  answerUrl: string | null;
  audioFiles: { name: string; url: string }[];
  answerKey: (AnswerKeyItem & { points: number | null; section: string | null })[];
  meta: ExamManifest["examInfo"] | null;
};

type ExamPageProps = {
  exams: ClientExam[];
};

const toFileUrl = (examId: string, relativePath?: string | null) =>
  relativePath
    ? `/api/exams/file?exam=${encodeURIComponent(examId)}&file=${encodeURIComponent(
        relativePath.replace(/\\/g, "/"),
      )}`
    : null;

export const getStaticProps: GetStaticProps<ExamPageProps> = async () => {
  const manifests = listExamManifests();

  const exams: ClientExam[] = manifests.map((manifest) => ({
    id: manifest.id,
    title: manifest.id,
    pdfUrl: toFileUrl(manifest.id, manifest.pdfFile),
    answerUrl: toFileUrl(manifest.id, manifest.answerFile),
    audioFiles: manifest.audioFiles.map((file) => ({
      name: file,
      url: toFileUrl(manifest.id, [manifest.audioFolder, file].filter(Boolean).join("/"))!,
    })),
    answerKey: manifest.answerKey.map((item) => ({
      ...item,
      points: item.points ?? null,
      section: item.section ?? null,
    })),
    meta: manifest.examInfo ?? null,
  }));

  return { props: { exams } };
};

const ExamPage = ({ exams }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { user, initializing } = useAuthGuard();
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id ?? "");
  const [started, setStarted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [penEnabled, setPenEnabled] = useState(false);
  const [savingPdf, setSavingPdf] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const strokesRef = useRef<{ points: { x: number; y: number }[] }[]>([]);

  const currentExam = useMemo(
    () => exams.find((exam) => exam.id === selectedExamId),
    [exams, selectedExamId],
  );

  const questions = useMemo(
    () => (currentExam?.answerKey ?? []).filter((item) => Number.isFinite(item.answer)),
    [currentExam],
  );

  const totalQuestions = questions.length;
  const answeredCount = questions.filter(
    (q) => userAnswers[q.questionNumber] !== null && userAnswers[q.questionNumber] !== undefined,
  ).length;
  const currentQuestion =
    totalQuestions > 0 ? questions[Math.min(currentQuestionIndex, totalQuestions - 1)] : null;

  const results = useMemo(
    () =>
      questions.map((q) => {
        const userAnswer = userAnswers[q.questionNumber];
        const correct = userAnswer === q.answer;
        return { ...q, userAnswer, correct };
      }),
    [questions, userAnswers],
  );

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#e11d48";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    strokesRef.current.forEach((stroke) => {
      if (!stroke.points.length) return;
      ctx.beginPath();
      stroke.points.forEach((point, idx) => {
        if (idx === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  }, []);

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = viewerRef.current;
    if (canvas && container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    }
  }, [redrawCanvas]);

  const clearAnnotations = useCallback(() => {
    strokesRef.current = [];
    setStrokeCount(0);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    syncCanvasSize();
    const handler = () => syncCanvasSize();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [syncCanvasSize]);

  useEffect(() => {
    setStarted(false);
    setScore(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setPenEnabled(false);
    setSaveMessage(null);
    setStrokeCount(0);
    clearAnnotations();
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [selectedExamId, clearAnnotations]);

  useEffect(() => {
    const tracks = currentExam?.audioFiles ?? [];
    const audio = audioRef.current;
    if (!audio) return;
    if (!tracks.length) {
      audio.removeAttribute("src");
      setIsPlaying(false);
      return;
    }
    const safeIndex = Math.min(currentTrackIndex, tracks.length - 1);
    if (safeIndex !== currentTrackIndex) {
      setCurrentTrackIndex(safeIndex);
      return;
    }
    const track = tracks[safeIndex];
    audio.src = track.url;
    audio.load();
    if (!started) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentExam, currentTrackIndex, started]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    [],
  );

  if (!user && !initializing) {
    return null;
  }

  if (!exams.length) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">真题练习</h1>
        <p className="text-slate-600">exams 文件夹下未找到任何试卷。</p>
      </section>
    );
  }

  const handleStartExam = () => {
    if (!currentExam) return;
    setUserAnswers({});
    setScore(null);
    setCurrentQuestionIndex(0);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setSaveMessage(null);
    setPenEnabled(false);
    setStrokeCount(0);
    clearAnnotations();
    setStarted(true);
  };

  const handleSubmit = () => {
    if (!started || !totalQuestions) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    const correct = questions.reduce((count, question) => {
      const userAnswer = userAnswers[question.questionNumber];
      return userAnswer === question.answer ? count + 1 : count;
    }, 0);
    setScore({ correct, total: totalQuestions });
  };

  const handleAudioEnded = () => {
    if (!currentExam) return;
    if (currentTrackIndex < currentExam.audioFiles.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrimaryAction = () => {
    if (!started) {
      handleStartExam();
    } else {
      handleSubmit();
    }
  };

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!penEnabled || !started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = getPoint(event);
    canvas.setPointerCapture(event.pointerId);
    strokesRef.current.push({ points: [point] });
    setIsDrawing(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!penEnabled || !isDrawing || !started) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    if (!stroke) return;
    const point = getPoint(event);
    const lastPoint = stroke.points[stroke.points.length - 1];
    stroke.points.push(point);
    if (lastPoint) {
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!penEnabled || !started) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(event.pointerId);
    }
    setIsDrawing(false);
    setStrokeCount(strokesRef.current.length);
  };

  const handleSaveAnnotatedPdf = async () => {
    if (!started || !currentExam?.pdfUrl || !canvasRef.current) return;
    setSavingPdf(true);
    setSaveMessage(null);
    try {
      const pdfBytes = await fetch(currentExam.pdfUrl).then((res) => res.arrayBuffer());
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pngDataUrl = canvasRef.current.toDataURL("image/png");
      const pngImage = await pdfDoc.embedPng(pngDataUrl);
      const firstPage = pdfDoc.getPage(0);
      const { width, height } = firstPage.getSize();
      const canvasWidth = canvasRef.current.width || 1;
      const canvasHeight = canvasRef.current.height || 1;
      const scale = Math.min(width / canvasWidth, height / canvasHeight);
      const pngWidth = canvasWidth * scale;
      const pngHeight = canvasHeight * scale;
      firstPage.drawImage(pngImage, {
        x: 0,
        y: height - pngHeight,
        width: pngWidth,
        height: pngHeight,
        opacity: 0.8,
      });
      const updated = await pdfDoc.save();
      const blob = new Blob([updated], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${currentExam.id}-annotated.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setSaveMessage("已生成带标注的 PDF");
    } catch (error) {
      console.error("Failed to save annotated PDF", error);
      setSaveMessage("保存失败，请重试");
    } finally {
      setSavingPdf(false);
    }
  };

  const metaText = currentExam?.meta
    ? [currentExam.meta.year, currentExam.meta.session, currentExam.meta.level, currentExam.meta.type]
        .filter(Boolean)
        .join(" · ")
    : null;

  const renderPreStart = () => (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <p className="text-sm text-slate-600">请选择试卷后，点击顶部的“开始考试”进入作答。</p>
      {metaText && <span className="text-xs text-slate-500">当前试卷：{metaText}</span>}
    </div>
  );

  const renderStarted = () => (
    <>
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={handleAudioEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="none"
      />
      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500">试卷 PDF · 支持触控笔勾画</p>
              <p className="font-semibold">{currentExam?.title ?? "未选择试卷"}</p>
              {metaText && <p className="text-xs text-slate-500 mt-1">{metaText}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="border px-3 py-2 rounded-md text-sm"
                onClick={() => setPenEnabled((prev) => !prev)}
                disabled={!currentExam?.pdfUrl}
              >
                {penEnabled ? "关闭笔迹" : "开启笔迹"}
              </button>
              <button
                className="border px-3 py-2 rounded-md text-sm disabled:opacity-50"
                onClick={clearAnnotations}
                disabled={!strokeCount}
              >
                清空笔迹
              </button>
              <button
                className="bg-secondary text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                onClick={handleSaveAnnotatedPdf}
                disabled={!currentExam?.pdfUrl || savingPdf}
              >
                {savingPdf ? "保存中..." : "保存带标注 PDF"}
              </button>
            </div>
          </div>

          <div
            ref={viewerRef}
            className="relative border rounded-lg bg-white overflow-hidden"
            style={{ minHeight: "calc(100vh - 220px)", height: "calc(100vh - 220px)" }}
          >
            {currentExam?.pdfUrl ? (
              <iframe
                src={`${currentExam.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="absolute inset-0 w-full h-full border-0"
                title="exam-pdf"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                当前试卷缺少 PDF 文件
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="absolute inset-0"
              style={{
                pointerEvents: penEnabled ? "auto" : "none",
                touchAction: penEnabled ? "none" : "auto",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => setIsDrawing(false)}
            />
            {!penEnabled && currentExam?.pdfUrl && (
              <div className="absolute top-3 right-3 rounded bg-white/85 px-3 py-1 text-xs text-slate-600">
                开启笔迹后可用触控笔勾画
              </div>
            )}
          </div>
          {saveMessage && <p className="text-xs text-primary">{saveMessage}</p>}
        </div>

        <div className="bg-white border rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs text-slate-500">作答区 · 单选</p>
              <p className="font-semibold">共 {totalQuestions} 题 · 已答 {answeredCount}</p>
            </div>
          </div>

          {currentQuestion ? (
            <>
              <div className="border rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium">
                  第 {currentQuestion.questionNumber} 题 {currentQuestion.section ? `· ${currentQuestion.section}` : ""}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((choice) => (
                    <label
                      key={choice}
                      className={`flex items-center gap-2 border rounded-md px-3 py-2 text-sm ${
                        userAnswers[currentQuestion.questionNumber] === choice
                          ? "border-primary bg-primary/5"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQuestion.questionNumber}`}
                        checked={userAnswers[currentQuestion.questionNumber] === choice}
                        onChange={() =>
                          setUserAnswers((prev) => ({ ...prev, [currentQuestion.questionNumber]: choice }))
                        }
                      />
                      <span>选项 {choice}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="border px-3 py-2 rounded-md text-sm disabled:opacity-50"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  上一题
                </button>
                <button
                  className="border px-3 py-2 rounded-md text-sm disabled:opacity-50"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  disabled={currentQuestionIndex >= totalQuestions - 1}
                >
                  下一题
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">未检测到可判分的选择题，请检查答案 JSON。</p>
          )}

          {score && (
            <div className="space-y-2">
              <p className="font-semibold text-sm">逐题正误</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {results.map((item) => (
                  <div
                    key={item.questionNumber}
                    className={`border rounded-md p-2 text-sm ${
                      item.correct ? "border-emerald-400 bg-emerald-50" : "border-rose-400 bg-rose-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        题 {item.questionNumber} {item.section ? `· ${item.section}` : ""}
                      </span>
                      <span className="text-xs">{item.correct ? "正确" : "错误"}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      你的答案：{item.userAnswer ?? "-"} / 正确答案：{item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">真题练习</h1>
          <p className="text-slate-600 text-sm">选择试卷后开始考试，自动播放听力并按答案文件顺序作答。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          <button
            className="bg-primary text-white px-4 py-2 rounded-md disabled:opacity-50"
            onClick={handlePrimaryAction}
            disabled={!currentExam || !currentExam.pdfUrl || (started && !totalQuestions)}
          >
            {started ? "交卷阅分" : "开始考试"}
          </button>
          {score && (
            <span className="text-sm text-emerald-600">
              得分 {score.correct}/{score.total}
            </span>
          )}
        </div>
      </div>

      {!started ? renderPreStart() : renderStarted()}
    </section>
  );
};

export default ExamPage;
