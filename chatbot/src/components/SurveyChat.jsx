"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SurveyChat() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  const questions = [
    {
      text: "🦆 Chào bạn! Mình là DuckBot - trợ lý học tập của bạn. Mình có thể hỏi bạn vài câu để cá nhân hóa lộ trình học không?",
      options: ["Có, bắt đầu thôi!", "Để sau nhé"],
    },
    {
      text: "Tuyệt vời! Bạn muốn học ngôn ngữ nào?",
      options: ["Tiếng Anh", "Tiếng Nhật", "Tiếng Hàn", "Ngôn ngữ khác"],
    },
    {
      text: "Bạn đang là ai?",
      options: ["Học sinh", "Sinh viên", "Người đi làm", "Khác"],
    },
    {
      text: "Trình độ hiện tại của bạn?",
      options: ["Mới bắt đầu", "Có nền tảng cơ bản", "Nền tảng khá", "Trình độ tốt"],
    },
    {
      text: "Mục đích học của bạn là gì?",
      options: ["Giao tiếp", "Công việc", "Du lịch", "Học tập", "Thi cử"],
    },
    {
      text: "Bạn có thể dành bao lâu mỗi ngày?",
      options: ["10 phút", "20 phút", "30 phút", "1 tiếng", "Trên 1 tiếng"],
    },
  ];

  const handleSelect = async (answer) => {
    setIsLoading(true);
    setAnswers(prev => [...prev, answer]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (answer === "Để sau nhé") {
      setStep(-1);
      setTimeout(() => {
        router.push("/chat");
      }, 2000);
    } else if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(999);
      setTimeout(() => {
        router.push("/chat");
      }, 2000);
    }
    
    setIsLoading(false);
  };

  const generateRecommendation = () => {
    if (answers.length < 5) return "";
    
    const language = answers[1];
    const role = answers[2];
    const level = answers[3];
    const goal = answers[4];
    const time = answers[5];
    
    return `DuckBot đã sẵn sàng! Với ${role} trình độ ${level.toLowerCase()} học ${language} cho ${goal.toLowerCase()}, mình sẽ thiết kế lộ trình phù hợp với ${time} mỗi ngày!`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 text-gray-800 px-4">
      {/* Progress Bar */}
      {step >= 0 && step < questions.length && (
        <div className="w-full max-w-lg mb-6">
          <div className="bg-gray-200 rounded-full h-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
            ></motion.div>
          </div>
          <div className="text-sm text-gray-600 text-center mt-2">
            Câu {step + 1} / {questions.length}
          </div>
        </div>
      )}

      {/* 🦆 Nhân vật vịt với animation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full max-w-lg"
      >
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative"
        >
          <img
            src="/images/duck_khao_sat.jpg" 
            alt="DuckBot"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg mb-4"
          />
          {/* Hiệu ứng sóng xung quanh vịt */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-yellow-300"
          ></motion.div>
        </motion.div>

        {/* Bubble chat */}
        {step >= 0 && step < questions.length && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white text-lg font-medium text-center px-6 py-4 rounded-2xl shadow-lg max-w-lg mb-4"
          >
            {questions[step].text}
            {/* Tail của bubble chat */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
          </motion.div>
        )}
        
        {/* Kết thúc sớm */}
        {step === -1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-lg font-medium text-center px-6 py-4 rounded-2xl shadow-lg max-w-lg"
          >
            <div className="text-4xl mb-2">😊</div>
            Không sao cả! Khi nào sẵn sàng hãy quay lại nhé!
            <div className="text-sm text-gray-500 mt-2">
              Đang chuyển đến DuckBot...
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mt-3"
            />
          </motion.div>
        )}
        
        {/* Hoàn tất */}
        {step === 999 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white text-lg font-medium text-center px-6 py-6 rounded-2xl shadow-lg max-w-lg"
          >
            <div className="text-4xl mb-3">🎉</div>
            Hoàn thành khảo sát!
            <div className="text-sm text-gray-600 mt-3">
              {generateRecommendation()}
            </div>
            <div className="mt-4 text-2xl">
              Cùng bắt đầu hành trình với DuckBot! 🚀
            </div>
            <div className="text-sm text-gray-500 mt-3">
              Đang chuyển đến DuckBot...
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto mt-3"
            />
          </motion.div>
        )}
      </motion.div>

      {/* 🔘 Các lựa chọn với loading state */}
      {step >= 0 && step < questions.length && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-6 max-w-lg"
        >
          {questions[step].options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ 
                scale: isLoading ? 1 : 1.05,
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              onClick={() => !isLoading && handleSelect(opt)}
              disabled={isLoading}
              className={`
                relative px-6 py-3 rounded-xl shadow-md font-medium
                transition-all duration-200 min-w-[120px]
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
                }
                text-white
              `}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                opt
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}