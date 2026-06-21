/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { SecurityAlerts } from './components/SecurityAlerts';
import { SubmissionModal } from './components/SubmissionModal';
import { IdleModal } from './components/IdleModal';
import { ViewportWarningModal } from './components/ViewportWarningModal';
import { Results } from './components/Results';
import { Header } from './components/Header';
import { Navigator } from './components/Navigator';
import { QuestionArea } from './components/QuestionArea';
import { FooterControls } from './components/FooterControls';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { JambCalculator } from './components/JambCalculator';
import { Calculator } from 'lucide-react';

import { useTimer } from './hooks/useTimer';
import { useSecurity } from './hooks/useSecurity';
import { mockQuestions, CANDIDATE_INFO, EXAM_DURATION_SECONDS } from './data';
import { AnswerStatus, CandidateResult, CandidateInfo, Question } from './types';

import { db } from './lib/firebase';
import { collection, query, where, getDocs, limit, orderBy, addDoc } from 'firebase/firestore';

const cleanQuestionText = (text: string): string => {
  if (!text) return '';
  let cleaned = text;

  // 1. Remove bracketed prefix patterns like [Academic Registry System Audit]
  cleaned = cleaned.replace(/^\[[^\]]+\]\s*[-–—:]?\s*/gi, '');

  // 2. Remove standard labels if present at start
  cleaned = cleaned.replace(/^(scenario|explanation|description|note)\s*:\s*/gi, '');

  // 3. Remove trailing bracket explanations or notes if any
  cleaned = cleaned.replace(/\s*\[(?:explanation|note|description|info|scenario)[^\]]*\]/gi, '');
  cleaned = cleaned.replace(/\s*\((?:explanation|note|description|info|scenario)[^)]*\)/gi, '');

  return cleaned.trim();
};

type AppState = 'login' | 'dashboard' | 'exam' | 'results' | 'admin';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>(CANDIDATE_INFO);
  const [examDuration, setExamDuration] = useState(EXAM_DURATION_SECONDS);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [showViewportWarning, setShowViewportWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CandidateResult | null>(null);

  // Exam State
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [examStatus, setExamStatus] = useState<Record<string, AnswerStatus>>({});
  const [reviewAnimationTrigger, setReviewAnimationTrigger] = useState(0);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const { securityStats, warnings, requestFullscreen, toggleFullscreen, dismissWarning } = useSecurity(appState === 'exam');
  
  const handleTimerExpire = useCallback(() => {
     handleFinalSubmit();
  }, [answers, examStatus]); // Requires deps if referenced inside, let's keep it simple

  useEffect(() => {
      
  }, []);

  const { 
      formattedTime, 
      start: startTimer, 
      stop: stopTimer, 
      secondsRemaining,
      isWarning,
      isCritical
  } = useTimer(examDuration, handleTimerExpire);

  // Update logic to handle late-bound callback closure issue
  useEffect(() => {
    if (secondsRemaining <= 0 && appState === 'exam') {
        handleFinalSubmit();
    }
  }, [secondsRemaining, appState]);

  // Continuously save state to localStorage so connection drops / page reloads don't lose data
  useEffect(() => {
     if (appState === 'exam') {
        const stateToSave = {
            subject: candidateInfo.subject,
            secondsRemaining, // from useTimer
            answers,
            examStatus,
            examQuestions, // To keep the exact shuffled array
            currentQuestionIndex
        };
        localStorage.setItem(`cbt_exam_state_${candidateInfo.id}`, JSON.stringify(stateToSave));
     }
  }, [appState, answers, examStatus, currentQuestionIndex, secondsRemaining, candidateInfo.subject, candidateInfo.id, examQuestions]);

  const handleStudentLogin = async (regNo: string, selectedSubject: string) => {
      try {
          // Adjust exam duration (90 minutes straight for compulsory CBT exam)
          const newDuration = 90 * 60;
          setExamDuration(newDuration);

          // Attempt to fetch candidate info
          const qC = query(collection(db, 'candidates'), where('candidate_id', '==', regNo), limit(1));
          const querySnapshot = await getDocs(qC);
          if (!querySnapshot.empty) {
             const data = querySnapshot.docs[0].data();
             setCandidateInfo({
                 name: `${data.first_name} ${data.last_name}`,
                 id: data.candidate_id,
                 examTitle: CANDIDATE_INFO.examTitle,
                 subject: selectedSubject
             });
          } else {
               setCandidateInfo({ ...CANDIDATE_INFO, id: regNo, subject: selectedSubject });
          }

          // Fetch exam questions
          let questionsSnapshot = await getDocs(collection(db, 'questions'));
          
          let needsReseed = false;
          if (questionsSnapshot.size < 600) {
              needsReseed = true;
          } else if (questionsSnapshot.size > 0 && !questionsSnapshot.docs[0].data().difficulty) {
              needsReseed = true;
          } else {
              // Check if any loaded question has older scenario bracket prefix or legacy ACCESS subject
              needsReseed = questionsSnapshot.docs.some(doc => {
                  const d = doc.data();
                  const txt = d.question_text || '';
                  const sub = d.subject || '';
                  return txt.trim().startsWith('[') || sub.toUpperCase() === 'ACCESS';
              });
          }

          if (needsReseed) {
              const { seedQuestionsDB } = await import('./lib/seedQuestions');
              await seedQuestionsDB();
              questionsSnapshot = await getDocs(collection(db, 'questions'));
          }

          const allQuestions: Question[] = [];
          questionsSnapshot.forEach(doc => {
             const d = doc.data();
             allQuestions.push({
                 id: doc.id,
                 type: d.question_type,
                 text: cleanQuestionText(d.question_text),
                 options: d.options || [],
                 correctAnswer: d.correct_answer,
                 points: d.points || 1,
                 subject: d.subject || 'General',
                 difficulty: d.difficulty || 'Beginner'
             });
          });

          // Group by subjects
          const bySubject: Record<string, Question[]> = {
              'EXCEL': [],
              'MICROSOFT WORD': [],
              'POWERPOINT': [],
              'WINDOWS OPERATION': []
          };
          
          allQuestions.forEach(q => {
             if (q.subject && bySubject[q.subject.toUpperCase()]) {
                 bySubject[q.subject.toUpperCase()].push(q);
             } else if (q.subject && q.subject.toUpperCase() === 'WORD') {
                 bySubject['MICROSOFT WORD'].push(q);
             }
          });

          let selectedQuestions: Question[] = [];
          
          const subjectsToProcess = selectedSubject === 'ICT Core Subjects' 
                ? ['EXCEL', 'MICROSOFT WORD', 'POWERPOINT', 'WINDOWS OPERATION']
                : [selectedSubject];

          subjectsToProcess.forEach(sub => {
              const qs = bySubject[sub] || [];
              
              // Shuffle helper
              const shuffle = (arr: Question[]) => {
                  const copy = [...arr];
                  for (let i = copy.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [copy[i], copy[j]] = [copy[j], copy[i]];
                  }
                  return copy;
              };

              // All questions are standard Professional/Higher College level
              let subjectQuestions = shuffle(qs).slice(0, 50);
              
              selectedQuestions = [...selectedQuestions, ...subjectQuestions];
          });

          if (selectedQuestions.length === 0) {
              // Fallback to mock if db is empty
              selectedQuestions = mockQuestions;
          }
          
          const savedStateStr = localStorage.getItem(`cbt_exam_state_${regNo}`);
          let loadedState = null;
          if (savedStateStr) {
               try {
                  loadedState = JSON.parse(savedStateStr);
               } catch (e) {}
          }

          if (loadedState && loadedState.subject === selectedSubject) {
              setExamDuration(loadedState.secondsRemaining);
              setAnswers(loadedState.answers);
              setExamStatus(loadedState.examStatus);
              setExamQuestions(loadedState.examQuestions || selectedQuestions);
              if (typeof loadedState.currentQuestionIndex === 'number') {
                  setCurrentQuestionIndex(loadedState.currentQuestionIndex);
              }
          } else {
              setExamQuestions(selectedQuestions);
              
              // Initialize Exam Array
              const initialStatus: Record<string, AnswerStatus> = {};
              selectedQuestions.forEach((q, i) => {
                  initialStatus[q.id] = i === 0 ? 'unanswered' : 'not-visited';
              });
              setExamStatus(initialStatus);
          }

          // Attempt to fetch configured exam title

          const examQ = query(collection(db, 'exams'), orderBy('created_at', 'desc'), limit(1));
          const examSnapshot = await getDocs(examQ);
          if (!examSnapshot.empty) {
              const examData = examSnapshot.docs[0].data();
              if (examData.title) {
                  setCandidateInfo(prev => ({ ...prev, examTitle: examData.title }));
              }
          }

      } catch (e) {
          console.error("Login Error:", e);
          setCandidateInfo({ ...CANDIDATE_INFO, id: regNo });
          setExamQuestions(mockQuestions);
      }
      setAppState('dashboard');
  };

  const handleAdminLogin = () => {
      setAppState('admin');
  };

  const handleStart = async () => {
      await requestFullscreen();
      setAppState('exam');
      startTimer();
  };

  const handleAnswerChange = (newAnswer: string | string[]) => {
      const q = examQuestions[currentQuestionIndex];
      if (!q) return;
      setAnswers(prev => ({ ...prev, [q.id]: newAnswer }));
      
      const hasAnswer = Array.isArray(newAnswer) ? newAnswer.length > 0 : !!newAnswer;
      if (examStatus[q.id] !== 'marked-for-review') {
          setExamStatus(prev => ({ 
              ...prev, 
              [q.id]: hasAnswer ? 'answered' : 'unanswered' 
          }));
      }
  };

  const handleClear = () => {
    const q = examQuestions[currentQuestionIndex];
    if (!q) return;
    const newAnswers = { ...answers };
    delete newAnswers[q.id];
    setAnswers(newAnswers);
    setExamStatus(prev => ({ ...prev, [q.id]: 'unanswered' }));
  };

  const handleMarkReview = () => {
     const q = examQuestions[currentQuestionIndex];
     if (!q) return;
     const current = examStatus[q.id];
     setExamStatus(prev => ({ 
         ...prev, 
         [q.id]: current === 'marked-for-review' ? (answers[q.id] ? 'answered' : 'unanswered') : 'marked-for-review' 
     }));
     setReviewAnimationTrigger(prev => prev + 1);
  };

  const navigateTo = (index: number) => {
     setCurrentQuestionIndex(index);
     const qId = examQuestions[index].id;
     if (examStatus[qId] === 'not-visited') {
         setExamStatus(prev => ({ ...prev, [qId]: 'unanswered' }));
     }
  };

  const handleNext = () => {
      if (currentQuestionIndex < examQuestions.length - 1) {
          navigateTo(currentQuestionIndex + 1);
      }
  };

  const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
          navigateTo(currentQuestionIndex - 1);
      }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    if (appState !== 'exam' || showIdleModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Case 1: Submission Confirmation Modal is visible
      if (showSubmitModal) {
        if (key === 'y') {
          e.preventDefault();
          handleFinalSubmit();
        } else if (key === 'n') {
          e.preventDefault();
          setShowSubmitModal(false);
        }
        return;
      }

      // Case 2: Standard Examination view keyboard shortcuts
      // A, B, C, D hotkeys to choose option
      if (['a', 'b', 'c', 'd'].includes(key)) {
        e.preventDefault();
        const q = examQuestions[currentQuestionIndex];
        if (q && q.options && q.options.length > 0) {
          const index = key.charCodeAt(0) - 97; // a=0, b=1, c=2, d=3
          if (index < q.options.length) {
            const selectedOption = q.options[index];
            if (q.type === 'mcq' || q.type === 'tf') {
              handleAnswerChange(selectedOption);
            } else if (q.type === 'mrx') {
              // Multiselect toggle
              const currentAnswers = (Array.isArray(answers[q.id]) ? answers[q.id] : []) as string[];
              if (currentAnswers.includes(selectedOption)) {
                handleAnswerChange(currentAnswers.filter(a => a !== selectedOption));
              } else {
                handleAnswerChange([...currentAnswers, selectedOption]);
              }
            }
          }
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
        case 'N':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'p':
        case 'P':
          e.preventDefault();
          handlePrevious();
          break;
        case 'r':
        case 'R':
        case 'm':
        case 'M':
          e.preventDefault();
          handleMarkReview();
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          handleClear();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setShowSubmitModal(true);
          break;
        case 'k':
        case 'K':
          e.preventDefault();
          setIsCalcOpen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, currentQuestionIndex, showSubmitModal, showIdleModal, examQuestions, examStatus, answers]);

  // Idle Timer
  useEffect(() => {
      if (appState !== 'exam' || showSubmitModal) {
          setShowIdleModal(false);
          return;
      }

      let idleTimer: ReturnType<typeof setTimeout>;

      const resetTimer = () => {
          clearTimeout(idleTimer);
          if (!showIdleModal) {
              idleTimer = setTimeout(() => {
                  setShowIdleModal(true);
              }, 5 * 60 * 1000); // 5 minutes
          }
      };

      const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
      
      events.forEach(e => window.addEventListener(e, resetTimer));
      resetTimer();

      return () => {
          clearTimeout(idleTimer);
          events.forEach(e => window.removeEventListener(e, resetTimer));
      };
  }, [appState, showIdleModal, showSubmitModal]);

  const handleFinalSubmit = async () => {
      stopTimer();
      setShowSubmitModal(false);
      setIsSubmitting(true);
      
      let score = 0;
      let totalPoints = 0;
      let correctCount = 0;
      let incorrectCount = 0;
      let unansweredCount = 0;
      const mcqBreakdown: Record<string, boolean> = {};

      examQuestions.forEach(q => {
          totalPoints += q.points;
          const ans = answers[q.id];
          
          if (!ans || (Array.isArray(ans) && ans.length === 0)) {
              unansweredCount++;
              mcqBreakdown[q.id] = false;
              return;
          }

          let isCorrect = false;

          if (q.type === 'mcq' || q.type === 'tf' || q.type === 'fill') {
              if (typeof ans === 'string' && typeof q.correctAnswer === 'string') {
                  isCorrect = ans.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
              }
          } else if (q.type === 'mrx') {
              if (Array.isArray(ans) && Array.isArray(q.correctAnswer)) {
                  if (ans.length === q.correctAnswer.length) {
                       isCorrect = ans.every(a => (q.correctAnswer as string[]).includes(a));
                  }
              }
          } else if (q.type === 'essay') {
              isCorrect = typeof ans === 'string' && ans.length > 50;
          }

          if (isCorrect) {
              score += q.points;
              correctCount++;
          } else {
              incorrectCount++;
          }
          mcqBreakdown[q.id] = isCorrect;
      });

      const timeSpent = examDuration - secondsRemaining;
      
      const examResult: CandidateResult = {
          score,
          totalPoints,
          percentage: (score / totalPoints) * 100,
          timeSpent,
          correctCount,
          incorrectCount,
          unansweredCount,
          mcqBreakdown
      };

      try {
        await addDoc(collection(db, 'exam_results'), {
          candidate_id: candidateInfo.id,
          candidate_name: candidateInfo.name,
          exam_title: candidateInfo.examTitle,
          subject: candidateInfo.subject,
          score: examResult.score,
          total_points: examResult.totalPoints,
          percentage: examResult.percentage,
          time_spent_seconds: examResult.timeSpent,
          correct_count: examResult.correctCount,
          incorrect_count: examResult.incorrectCount,
          unanswered_count: examResult.unansweredCount,
          mcq_breakdown: examResult.mcqBreakdown,
          security_stats: securityStats,
          created_at: new Date().toISOString()
        });
        
        // Clear local storage after successful submission
        localStorage.removeItem(`cbt_exam_state_${candidateInfo.id}`);
      } catch (err) {
        console.error('Failed to submit exam data:', err);
      }

      setIsSubmitting(false);
      setResult(examResult);
      setAppState('results');
  };

  if (appState === 'login') {
      return <Login onStudentLogin={handleStudentLogin} onAdminLogin={handleAdminLogin} />;
  }

  if (appState === 'admin') {
      return <AdminDashboard onLogout={() => setAppState('login')} />;
  }

  if (appState === 'dashboard') {
      return (
          <Dashboard 
             candidate={candidateInfo} 
             onStart={handleStart} 
             examDuration={examDuration}
             totalQuestions={examQuestions.length}
          />
      );
  }

  const handleRestart = () => {
      if (candidateInfo && candidateInfo.id) {
          localStorage.removeItem(`cbt_exam_state_${candidateInfo.id}`);
      }
      setAnswers({});
      setExamStatus({});
      setExamQuestions([]);
      setCurrentQuestionIndex(0);
      setIsPanelOpen(false);
      setShowSubmitModal(false);
      setShowIdleModal(false);
      setIsSubmitting(false);
      setResult(null);
      setIsCalcOpen(false);
      setAppState('login');
  };

  if (appState === 'results' && result) {
      return <Results result={result} candidate={candidateInfo} onRestart={handleRestart} />;
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  if (!currentQuestion) return null;

  // Calculate subject starting indices
  const subjectStarts: { subject: string, index: number }[] = [];
  let currentSub = '';
  examQuestions.forEach((q, idx) => {
     if (q.subject && q.subject !== currentSub) {
         currentSub = q.subject;
         subjectStarts.push({ subject: q.subject, index: idx });
     }
  });

  const getSubjectStats = (subjectName: string) => {
    const qList = examQuestions.filter(q => q.subject === subjectName);
    const answered = qList.filter(q => {
      const ans = answers[q.id];
      return Array.isArray(ans) ? ans.length > 0 : !!ans;
    }).length;
    return {
      total: qList.length,
      answered
    };
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      <Header 
         candidate={candidateInfo}
         formattedTime={formattedTime}
         isWarning={isWarning}
         isCritical={isCritical}
         isFullscreen={securityStats.isFullscreen}
         onToggleFullscreen={toggleFullscreen}
      />
      
      {/* Dynamic Subject Tabs (JAMB CBT Style) */}
      {subjectStarts.length > 1 && (
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-wrap gap-2 items-center shrink-0 shadow-inner">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mr-2">Subject Sections:</span>
          {subjectStarts.map(({ subject, index }) => {
            const isActive = currentQuestion.subject === subject;
            const stats = getSubjectStats(subject);
            return (
              <button
                key={subject}
                type="button"
                onClick={() => navigateTo(index)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer flex items-center gap-2 ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{subject}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {stats.answered}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative select-none">
          
          {/* Main Question Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start">
              <div className="w-full max-w-4xl mb-6">
                  {/* Progress Header & Calculator Tray (JAMB CBT Style) */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                      <div>
                          <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                              Exam Progress
                          </span>
                          <span className="text-xs text-slate-400 font-mono hidden md:inline">
                              Hotkeys: <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">A</kbd> <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">B</kbd> <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">C</kbd> <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">D</kbd> Options | <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">N</kbd> Next | <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">P</kbd> Prev | <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">R</kbd> Review | <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold text-slate-600">C</kbd> Clear
                          </span>
                      </div>
                      
                      {/* Interactive Trays */}
                      <div className="flex items-center gap-2 self-stretch md:self-auto">
                          <button
                              type="button"
                              onClick={() => setIsCalcOpen(prev => !prev)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm cursor-pointer transition-all ${
                                isCalcOpen 
                                  ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                              title="Toggle On-Screen Calculator [K]"
                          >
                              <Calculator className="h-4 w-4 text-amber-600" />
                              <span>Calculator <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-[10px] font-bold">K</kbd></span>
                          </button>
                      </div>
                  </div>

                  <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                          Completed Questions
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                          {Object.keys(answers).filter(id => Array.isArray(answers[id]) ? answers[id].length > 0 : !!answers[id]).length} of {examQuestions.length} Answered
                      </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                          style={{ width: `${(Object.keys(answers).filter(id => Array.isArray(answers[id]) ? answers[id].length > 0 : !!answers[id]).length / Math.max(examQuestions.length, 1)) * 100}%` }}
                      ></div>
                  </div>
              </div>

              <QuestionArea 
                  question={currentQuestion}
                  currentIndex={currentQuestionIndex}
                  totalQuestions={examQuestions.length}
                  answer={answers[currentQuestion.id] || ''}
                  onAnswerChange={handleAnswerChange}
                  reviewAnimationTrigger={reviewAnimationTrigger}
              />
          </main>

          {/* Side Navigator */}
          <Navigator 
              questions={examQuestions}
              currentQuestionIndex={currentQuestionIndex}
              examStatus={examStatus}
              onNavigate={navigateTo}
              isPanelOpen={isPanelOpen}
              togglePanel={() => setIsPanelOpen(!isPanelOpen)}
          />

      </div>

      <FooterControls 
          onPrevious={handlePrevious}
          onNext={handleNext}
          onMarkReview={handleMarkReview}
          onClear={handleClear}
          onSubmit={() => setShowSubmitModal(true)}
          isFirst={currentQuestionIndex === 0}
          isLast={currentQuestionIndex === examQuestions.length - 1}
          currentStatus={examStatus[currentQuestion.id] || 'not-visited'}
      />

      {showSubmitModal && !isSubmitting && (
          <SubmissionModal 
              examStatus={examStatus}
              totalQuestions={examQuestions.length}
              onConfirm={handleFinalSubmit}
              onCancel={() => setShowSubmitModal(false)}
          />
      )}

      {isSubmitting && (
         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
             <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
                 <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                 <p className="text-slate-800 font-medium font-sans">Submitting examination data securely...</p>
             </div>
         </div>
      )}

      <SecurityAlerts warnings={warnings} onDismiss={dismissWarning} />

      <IdleModal 
          isOpen={showIdleModal}
          onContinue={() => setShowIdleModal(false)}
      />

      

      <JambCalculator 
          isOpen={isCalcOpen}
          onClose={() => setIsCalcOpen(false)}
      />

    </div>
  );
}

