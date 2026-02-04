"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Grid, ChevronRight, AlertCircle, Flag } from "lucide-react";
import { Question } from "@/lib/questions";
import { useRouter } from "next/navigation";
import { submitQuizResult, updateSessionActivity } from "@/app/actions";

interface QuizInterfaceProps {
    moduleId: string;
    questions: Question[];
}

export default function QuizInterface({ moduleId, questions }: QuizInterfaceProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({}); // questionId -> selectedIndex
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Timer Logic (50 minutes)
    const [timeLeft, setTimeLeft] = useState(50 * 60);

    // Guard Clause
    const currentQuestion = questions?.[currentIndex];

    useEffect(() => {
        if (isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished]);

    // Initialize and update session progress
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.id) {
                updateSessionActivity(user.id, moduleId, currentIndex, questions.length);
            }
        }
    }, [currentIndex, moduleId, questions.length]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!questions || questions.length === 0 || !currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
                <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Quiz</h2>
                <p className="text-steel-400">Unable to load questions for this module.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-navy-700 text-gold-500 rounded border border-gold-600/30 hover:bg-navy-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    const handleAnswer = (optionIndex: number) => {
        // Record answer
        const isCorrect = optionIndex === currentQuestion.correctIndex;

        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionIndex
        }));

        // Note: Score is calculated at submission or on-the-fly, 
        // but for real-time tracking we can keep it roughly updated
        // ideally we re-calc score entirely at end, but user wants to see it?
        // Actually for a real quiz, you don't usually see score until end.
        // But respecting previous logic:
        if (isCorrect) {
            // Logic to increment score only if not already answered correctly? 
            // Simplification: We'll calculate final score at end based on answers
        }
    };

    // Calculate final score based on answers state
    const calculateFinalScore = () => {
        let finalScore = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctIndex) {
                finalScore++;
            }
        });
        return finalScore;
    };

    const finishQuiz = async () => {
        const finalScore = calculateFinalScore();
        setScore(finalScore);
        setIsFinished(true);

        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.id) {
                    await submitQuizResult(user.id, moduleId, finalScore, questions.length, answers);
                }
            } catch (e) {
                console.error("Failed to save progress", e);
            }
        }
    };

    // Render Completed State
    if (isFinished) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-navy-900">
                <div className="flex flex-col items-center justify-center text-center space-y-8 p-12 bg-navy-800/50 border border-navy-600 rounded-3xl max-w-2xl w-full mx-4 shadow-2xl backdrop-blur-xl">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-6 rounded-full bg-navy-800 border-4 border-gold-500 shadow-2xl shadow-gold-500/20"
                    >
                        <CheckCircle className="w-20 h-20 text-gold-500" />
                    </motion.div>

                    <div className="space-y-2">
                        <h2 className="text-4xl font-bold text-steel-100 font-heading">ASSESSMENT COMPLETE</h2>
                        <p className="text-steel-400">Your results have been recorded.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="p-6 bg-navy-900/50 rounded-2xl border border-navy-700">
                            <div className="text-steel-400 text-xs uppercase tracking-wider mb-2">Final Score</div>
                            <div className="text-5xl font-bold text-gold-500">{score}</div>
                        </div>
                        <div className="p-6 bg-navy-900/50 rounded-2xl border border-navy-700">
                            <div className="text-steel-400 text-xs uppercase tracking-wider mb-2">Percentage</div>
                            <div className="text-5xl font-bold text-white">{Math.round((score / questions.length) * 100)}%</div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/modules')}
                        className="w-full py-4 bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold rounded-xl uppercase tracking-widest transition-all shadow-lg hover:shadow-gold-500/20"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex overflow-hidden">

            {/* LEFT: Main Content Area (Scrollable if needed, but keeping fixed as requested) */}
            <div className="flex-1 h-full flex flex-col relative">

                {/* Header for Question Area */}
                <div className="h-20 border-b border-navy-700 bg-navy-900/50 backdrop-blur-md flex items-center justify-between px-8">
                    <div>
                        <h1 className="text-lg font-bold text-gold-500 font-heading tracking-wider">
                            {moduleId.replace(/-/g, ' ').toUpperCase()}
                        </h1>
                        <div className="text-xs text-steel-400">Official Assessment • {questions.length} Questions</div>
                    </div>
                </div>

                {/* Question Container */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col items-center">
                    <div className="w-full max-w-4xl space-y-8">

                        {/* Question Box */}
                        <div className="bg-navy-800 border border-navy-600 rounded-sm p-8 shadow-lg relative">
                            {/* Question Number Tag */}
                            <div className="absolute top-0 left-0 bg-navy-700 text-steel-300 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-br-lg border-b border-r border-navy-600">
                                Question {currentIndex + 1}
                            </div>

                            <div className="mt-8 mb-8">
                                <h3 className="text-2xl md:text-3xl font-medium text-steel-100 leading-normal">
                                    {currentQuestion.text}
                                </h3>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                {currentQuestion.options.map((option, idx) => {
                                    const isSelected = answers[currentQuestion.id] === idx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`w-full text-left p-5 rounded-lg border transition-all flex items-center group ${isSelected
                                                ? "bg-navy-700 border-gold-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                                : "bg-navy-900/50 border-navy-700 hover:bg-navy-700 hover:border-navy-500"
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-bold text-sm transition-colors ${isSelected
                                                ? "border-gold-500 bg-gold-500 text-navy-900"
                                                : "border-navy-500 text-navy-500 group-hover:border-steel-300 group-hover:text-steel-300"
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className={`text-lg ${isSelected ? "text-white font-medium" : "text-steel-300"}`}>
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Navigation Controls (Prev/Next) */}
                        <div className="flex justify-between items-center pt-8">
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentIndex === 0}
                                className="px-6 py-3 rounded-lg text-steel-400 font-bold uppercase tracking-wider text-sm hover:bg-navy-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                disabled={currentIndex === questions.length - 1}
                                className="px-8 py-3 bg-gold-600 hover:bg-gold-500 text-navy-900 font-bold rounded-lg uppercase tracking-wider text-sm shadow-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next Question
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* RIGHT: Sidebar Navigation (Fixed) */}
            <div className="w-80 h-full bg-navy-950 border-l border-navy-700 flex flex-col shadow-2xl z-20">

                {/* Timer Section */}
                <div className="p-6 border-b border-navy-800 bg-navy-900/30">
                    <div className="text-xs text-steel-400 uppercase tracking-widest font-bold mb-2">Time Remaining</div>
                    <div className={`text-4xl font-mono font-bold tracking-tight ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Quiz Navigation Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Grid className="w-4 h-4 text-gold-500" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Quiz Navigation</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isCurrent = idx === currentIndex;

                            return (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`aspect-square rounded-md text-xs font-bold border transition-all relative ${isCurrent
                                        ? "border-gold-500 bg-gold-500/10 text-gold-400 ring-2 ring-gold-500/20"
                                        : isAnswered
                                            ? "bg-navy-800 border-navy-600 text-white" // Answered state (filled bottom half style logic could be complex, keeping simple clean)
                                            : "bg-navy-900 border-navy-800 text-navy-500 hover:border-navy-600"
                                        }`}
                                >
                                    {isAnswered && (
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-500" />
                                    )}
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legenda */}
                    <div className="mt-6 space-y-2 text-[10px] text-steel-400 uppercase tracking-wider font-semibold">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm border border-gold-500 bg-gold-500/10" /> Current
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-navy-800 border border-navy-600 relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-500" />
                            </div>
                            Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-navy-900 border border-navy-800" /> Not Answered
                        </div>
                    </div>
                </div>

                {/* Finish Attempt Section */}
                <div className="p-6 border-t border-navy-800 bg-navy-900/30">
                    <button
                        onClick={finishQuiz}
                        className="w-full py-3 bg-navy-800 hover:bg-red-900/50 hover:border-red-500/50 hover:text-red-400 text-steel-300 font-bold uppercase tracking-wider text-xs rounded-lg border border-navy-600 transition-all"
                    >
                        Finish Attempt ...
                    </button>
                </div>
            </div>

        </div>
    );
}
