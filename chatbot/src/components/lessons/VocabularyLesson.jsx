"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VocabularyLesson({ lesson, onComplete, onBack }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);
  const [progress, setProgress] = useState(0);

  const vocabularyList = [
    {
      word: "Hello",
      meaning: "Xin chào",
      pronunciation: "/həˈloʊ/",
      example: "Hello, my name is John.",
      exampleMeaning: "Xin chào, tôi tên là John.",
      type: "greeting"
    },
    {
      word: "Goodbye", 
      meaning: "Tạm biệt",
      pronunciation: "/ɡʊdˈbaɪ/",
      example: "Goodbye, see you tomorrow!",
      exampleMeaning: "Tạm biệt, hẹn gặp lại ngày mai!",
      type: "greeting"
    },
    {
      word: "Thank you",
      meaning: "Cảm ơn",
      pronunciation: "/ˈθæŋk juː/",
      example: "Thank you for your help.",
      exampleMeaning: "Cảm ơn vì sự giúp đỡ của bạn.",
      type: "politeness"
    }
  ];

  const currentWord = vocabularyList[currentWordIndex];

  useEffect(() => {
    setProgress(((currentWordIndex + 1) / vocabularyList.length) * 100);
  }, [currentWordIndex]);

  const handleNext = () => {
    if (!learnedWords.includes(currentWordIndex)) {
      setLearnedWords(prev => [...prev, currentWordIndex]);
    }
    
    setShowAnswer(false);
    
    if (currentWordIndex < vocabularyList.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Quay lại</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">{lesson.name}</h1>
            <p className="text-gray-600">Học từ vựng giao tiếp cơ bản</p>
          </div>
          
          <div className="w-20"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ học tập</span>
            <span>{currentWordIndex + 1}/{vocabularyList.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Word Card */}
        <motion.div
          key={currentWordIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <div className="text-center">
            {/* Word */}
            <motion.h2 
              className="text-5xl font-bold text-gray-800 mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {currentWord.word}
            </motion.h2>
            
            {/* Pronunciation */}
            <p className="text-xl text-gray-600 mb-6 font-mono">
              {currentWord.pronunciation}
            </p>

            {/* Show Answer Button */}
            {!showAnswer && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAnswer(true)}
                className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors mb-6"
              >
                👀 Xem nghĩa và ví dụ
              </motion.button>
            )}

            {/* Answer Section */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Meaning */}
                  <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Nghĩa tiếng Việt</h3>
                    <p className="text-3xl text-yellow-700 font-semibold">{currentWord.meaning}</p>
                  </div>

                  {/* Example */}
                  <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Ví dụ sử dụng</h3>
                    <div className="space-y-2">
                      <p className="text-2xl text-gray-800 font-medium">{currentWord.example}</p>
                      <p className="text-xl text-green-700">{currentWord.exampleMeaning}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentWordIndex === 0}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              currentWordIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            ← Từ trước
          </button>

          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>{currentWordIndex === vocabularyList.length - 1 ? "Hoàn thành 🎉" : "Từ tiếp theo"}</span>
            {currentWordIndex < vocabularyList.length - 1 && <span>→</span>}
          </button>
        </div>
      </div>
    </div>
  );
}