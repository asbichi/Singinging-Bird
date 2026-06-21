import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Type } from 'lucide-react';
import { Question } from '../types';
import { FormField } from './FormField';

interface QuestionAreaProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  answer: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  reviewAnimationTrigger?: number;
}

export const QuestionArea: React.FC<QuestionAreaProps> = ({
  question,
  currentIndex,
  totalQuestions,
  answer,
  onAnswerChange,
  reviewAnimationTrigger
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [animateState, setAnimateState] = useState({});
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>(() => {
    const saved = localStorage.getItem('exam-font-size');
    return (saved === 'sm' || saved === 'md' || saved === 'lg') ? saved : 'md';
  });

  const handleToggleFontSize = () => {
    setFontSize((prev) => {
      const next = prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm';
      localStorage.setItem('exam-font-size', next);
      return next;
    });
  };

  useEffect(() => {
    // Scroll to the top of the container when the question changes
    if (containerRef.current) {
      // Find the closest scrollable container (the main element in App.tsx)
      const scrollParent = containerRef.current.closest('main');
      if (scrollParent) {
        scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [question.id]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (reviewAnimationTrigger && reviewAnimationTrigger > 0) {
      // Trigger a subtle shake and pulse animation
      setAnimateState({
        x: [0, -6, 6, -4, 4, -2, 2, 0],
        scale: [1, 1.015, 0.985, 1.01, 1],
        transition: { duration: 0.45, ease: "easeInOut" }
      });
    }
  }, [reviewAnimationTrigger]);

  const fontSizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }[fontSize];

  return (
    <motion.div 
      ref={containerRef} 
      animate={animateState}
      onAnimationComplete={() => setAnimateState({})}
      className="max-w-4xl mx-auto w-full pb-20"
    >
      
      {/* Question Header */}
      <div className="mb-6 flex justify-between items-center border-b border-slate-200 pb-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Question Display</span>
          <button
              onClick={handleToggleFontSize}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors text-xs font-medium cursor-pointer"
              title="Change Text Size"
          >
              <Type className="h-3.5 w-3.5" />
              <span>Size: <span className="uppercase font-bold text-blue-600">{fontSize}</span></span>
          </button>
      </div>

      <div className="mb-8">
          <h2 className={`font-medium text-slate-800 leading-relaxed font-sans ${fontSizeClass}`}>
              {question.text}
          </h2>
      </div>

      {/* Answer Area */}
      <div className="bg-white p-2">
          <FormField 
            question={question} 
            answer={answer} 
            onAnswerChange={onAnswerChange} 
          />
      </div>

    </motion.div>
  );
};
