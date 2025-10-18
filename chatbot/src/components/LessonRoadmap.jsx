"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LessonRoadmap({ topic, onClose, onStartLesson }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Lộ trình học tập cho mỗi chủ đề
  const learningPath = [
    {
      id: 1,
      title: "🎯 Từ vựng cơ bản",
      description: "Học 15 từ vựng cốt lõi",
      type: "vocabulary",
      duration: "10 phút",
      words: 15,
      icon: "📖",
      color: "from-green-400 to-green-600"
    },
    {
      id: 2,
      title: "🧩 Ngữ pháp trọng điểm",
      description: "Nắm vững cấu trúc chính",
      type: "grammar",
      duration: "8 phút",
      rules: 3,
      icon: "🔤",
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      title: "🎮 Quiz nhỏ #1",
      description: "Kiểm tra từ vựng cơ bản",
      type: "quiz",
      duration: "5 phút",
      questions: 5,
      icon: "🧠",
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 4,
      title: "💬 Tình huống giao tiếp",
      description: "Thực hành hội thoại thực tế",
      type: "conversation",
      duration: "12 phút",
      scenarios: 4,
      icon: "💭",
      color: "from-orange-400 to-orange-600"
    },
    {
      id: 5,
      title: "📈 Từ vựng nâng cao",
      description: "Mở rộng vốn từ chuyên sâu",
      type: "vocabulary",
      duration: "15 phút",
      words: 20,
      icon: "🚀",
      color: "from-red-400 to-red-600"
    },
    {
      id: 6,
      title: "🎯 Quiz tổng hợp",
      description: "Đánh giá toàn diện",
      type: "quiz",
      duration: "8 phút",
      questions: 8,
      icon: "🎯",
      color: "from-pink-400 to-pink-600"
    },
    {
      id: 7,
      title: "🏆 Bài kiểm tra cuối",
      description: "Hoàn thành chủ đề",
      type: "test",
      duration: "10 phút",
      questions: 10,
      icon: "🏆",
      color: "from-yellow-400 to-yellow-600"
    }
  ];

  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "upcoming";
  };

  const getStepIcon = (step, status) => {
    if (status === "completed") return "✅";
    if (status === "current") return step.icon;
    return step.icon;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-t-3xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-5xl bg-white/20 p-4 rounded-2xl">
                  {topic.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{topic.title}</h2>
                  <p className="text-blue-100 text-lg">{topic.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>⏰ {topic.time}</span>
                    <span>📊 {topic.level}</span>
                    <span>📝 {topic.words} từ</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-3 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Lộ trình học tập</h3>
              <p className="text-gray-600">Hoàn thành {currentStep}/7 bước • {Math.round((currentStep / 7) * 100)}%</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round((currentStep / 7) * 100)}%</div>
              <div className="text-sm text-gray-500">Tiến độ</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 7) * 100}%` }}
              transition={{ duration: 1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            />
          </div>
        </div>

        {/* Learning Path */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {learningPath.map((step, index) => {
              const status = getStepStatus(index);
              const isCompleted = status === "completed";
              const isCurrent = status === "current";
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setCurrentStep(index)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    isCompleted 
                      ? "bg-green-50 border-green-200 shadow-sm" 
                      : isCurrent
                      ? "bg-blue-50 border-blue-300 shadow-md"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`text-2xl p-3 rounded-xl ${
                        isCompleted 
                          ? "bg-green-100 text-green-600" 
                          : isCurrent
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {getStepIcon(step, status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-bold text-lg ${
                            isCompleted ? "text-green-800" : 
                            isCurrent ? "text-blue-800" : 
                            "text-gray-700"
                          }`}>
                            {step.title}
                          </h3>
                          {isCurrent && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              Đang học
                            </span>
                          )}
                          {isCompleted && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Đã hoàn thành
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mt-1">{step.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {step.duration}
                          </span>
                          
                          {step.words && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                              </svg>
                              {step.words} từ
                            </span>
                          )}
                          
                          {step.questions && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                              {step.questions} câu hỏi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {isCurrent ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartLesson(step);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                        >
                          Bắt đầu
                        </motion.button>
                      ) : isCompleted ? (
                        <div className="text-green-600 font-medium">✅ Hoàn thành</div>
                      ) : (
                        <div className="text-gray-400">🔒</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-800">Hành trình khám phá</h4>
              <p className="text-gray-600 text-sm">Từng bước chinh phục {topic.title}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                disabled={currentStep === 6}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp theo →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}