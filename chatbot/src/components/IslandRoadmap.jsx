"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function IslandRoadmap({ topic, onClose, onStartLesson }) {
  const [currentIsland, setCurrentIsland] = useState(0);
  
  // Các hòn đảo trong hành trình học tập
  const islands = [
    {
      id: 1,
      name: "Đảo Từ Vựng Cơ Bản",
      description: "Khám phá 15 từ vựng cốt lõi",
      type: "vocabulary",
      duration: "10 phút",
      words: 15,
      icon: "🏝️",
      color: "from-emerald-400 to-emerald-600",
      terrain: "coconut",
      completed: true
    },
    {
      id: 2,
      name: "Đảo Ngữ Pháp",
      description: "Chinh phục 3 cấu trúc ngữ pháp",
      type: "grammar",
      duration: "8 phút",
      rules: 3,
      icon: "🗿",
      color: "from-blue-400 to-blue-600",
      terrain: "mountain",
      completed: true
    },
    {
      id: 3,
      name: "Đảo Thử Thách #1",
      description: "Vượt qua 5 câu hỏi đầu tiên",
      type: "quiz",
      duration: "5 phút",
      questions: 5,
      icon: "⚔️",
      color: "from-purple-400 to-purple-600",
      terrain: "volcano",
      completed: false,
      current: true
    },
    {
      id: 4,
      name: "Vịnh Giao Tiếp",
      description: "Thực hành 4 tình huống thực tế",
      type: "conversation",
      duration: "12 phút",
      scenarios: 4,
      icon: "🏖️",
      color: "from-teal-400 to-teal-600",
      terrain: "beach",
      completed: false
    },
    {
      id: 5,
      name: "Đảo Từ Vựng Nâng Cao",
      description: "Chinh phục 20 từ chuyên sâu",
      type: "vocabulary",
      duration: "15 phút",
      words: 20,
      icon: "🏔️",
      color: "from-orange-400 to-orange-600",
      terrain: "cliff",
      completed: false
    },
    {
      id: 6,
      name: "Eo Biển Tổng Hợp",
      description: "Vượt qua 8 câu hỏi đánh giá",
      type: "quiz",
      duration: "8 phút",
      questions: 8,
      icon: "🌊",
      color: "from-cyan-400 to-cyan-600",
      terrain: "strait",
      completed: false
    },
    {
      id: 7,
      name: "Đảo Kho Báu Cuối",
      description: "Chiến thắng bài kiểm tra cuối",
      type: "test",
      duration: "10 phút",
      questions: 10,
      icon: "💎",
      color: "from-yellow-400 to-yellow-600",
      terrain: "treasure",
      completed: false
    }
  ];

  const getIslandStatus = (island) => {
    if (island.completed) return "conquered";
    if (island.current) return "current";
    return "locked";
  };

  const getTerrainIcon = (terrain) => {
    const terrains = {
      coconut: "🥥",
      mountain: "⛰️",
      volcano: "🌋",
      beach: "🏖️",
      cliff: "🧗",
      strait: "🌊",
      treasure: "📦"
    };
    return terrains[terrain] || "🏝️";
  };

  const getConnectionLine = (index) => {
    if (index === islands.length - 1) return null;
    
    const currentStatus = getIslandStatus(islands[index]);
    const nextStatus = getIslandStatus(islands[index + 1]);
    
    if (currentStatus === "conquered" && nextStatus !== "locked") {
      return "bg-green-400"; // Đường đã mở
    } else if (currentStatus === "current") {
      return "bg-yellow-400"; // Đường hiện tại
    }
    return "bg-gray-300"; // Đường chưa mở
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-blue-50 bg-opacity-90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col border-2 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header với hình ảnh đại dương */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-8 rounded-t-3xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-5xl bg-white/20 p-4 rounded-2xl">
                  🗺️
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Hành Trình Khám Phá</h2>
                  <p className="text-blue-100 text-lg">{topic.title}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>⏰ {topic.time}</span>
                    <span>📊 {topic.level}</span>
                    <span>🏝️ {islands.length} đảo</span>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Tiến Độ Hành Trình</h3>
              <p className="text-gray-600">Đã chinh phục {islands.filter(i => i.completed).length}/{islands.length} đảo</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((islands.filter(i => i.completed).length / islands.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
          
          {/* Progress Bar với theme đại dương */}
          <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(islands.filter(i => i.completed).length / islands.length) * 100}%` }}
              transition={{ duration: 1.5 }}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-4 rounded-full relative"
            >
              {/* Wave pattern trên progress bar */}
              <div className="absolute inset-0 opacity-20 bg-wave-pattern"></div>
            </motion.div>
          </div>
        </div>

        {/* Island Map */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="relative">
            {/* Ocean Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-cyan-100 rounded-2xl -z-10"></div>
            
            {/* Islands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {islands.map((island, index) => {
                const status = getIslandStatus(island);
                const isConquered = status === "conquered";
                const isCurrent = status === "current";
                const isLocked = status === "locked";
                
                return (
                  <motion.div
                    key={island.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Connection Lines */}
                    {index % 2 === 0 && index < islands.length - 1 && (
                      <div className={`absolute top-1/2 left-1/2 w-24 h-1 ${getConnectionLine(index)} transform rotate-12 z-0`}></div>
                    )}
                    {index % 2 === 1 && index < islands.length - 1 && (
                      <div className={`absolute top-1/2 right-1/2 w-24 h-1 ${getConnectionLine(index)} transform -rotate-12 z-0`}></div>
                    )}

                    {/* Island Card */}
                    <motion.div
                      whileHover={{ scale: isLocked ? 1 : 1.05 }}
                      whileTap={{ scale: isLocked ? 1 : 0.95 }}
                      onClick={() => !isLocked && setCurrentIsland(index)}
                      className={`relative p-6 rounded-2xl border-4 cursor-pointer transition-all ${
                        isConquered 
                          ? "bg-green-50 border-green-300 shadow-lg" 
                          : isCurrent
                          ? "bg-yellow-50 border-yellow-400 shadow-xl animate-pulse"
                          : isLocked
                          ? "bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed"
                          : "bg-white border-blue-300 hover:border-blue-400 hover:shadow-lg"
                      }`}
                    >
                      {/* Island Terrain */}
                      <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl ${
                        isConquered ? "text-green-500" :
                        isCurrent ? "text-yellow-500" :
                        isLocked ? "text-gray-400" :
                        "text-blue-500"
                      }`}>
                        {getTerrainIcon(island.terrain)}
                      </div>

                      {/* Island Flag */}
                      <div className="absolute -top-2 right-4 text-2xl">
                        {isConquered ? "🏁" : isCurrent ? "🚩" : "🔒"}
                      </div>

                      <div className="text-center mt-6">
                        {/* Island Icon */}
                        <div className={`text-3xl mb-3 ${
                          isConquered ? "text-green-600" :
                          isCurrent ? "text-yellow-600" :
                          isLocked ? "text-gray-500" :
                          "text-blue-600"
                        }`}>
                          {island.icon}
                        </div>
                        
                        {/* Island Name */}
                        <h3 className={`font-bold text-lg mb-2 ${
                          isConquered ? "text-green-800" : 
                          isCurrent ? "text-yellow-800" : 
                          isLocked ? "text-gray-600" :
                          "text-blue-800"
                        }`}>
                          {island.name}
                        </h3>
                        
                        {/* Island Description */}
                        <p className="text-gray-600 text-sm mb-4">
                          {island.description}
                        </p>
                        
                        {/* Island Details */}
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="flex items-center justify-center space-x-1">
                            <span>⏱️</span>
                            <span>{island.duration}</span>
                          </div>
                          {island.words && (
                            <div className="flex items-center justify-center space-x-1">
                              <span>📖</span>
                              <span>{island.words} từ</span>
                            </div>
                          )}
                          {island.questions && (
                            <div className="flex items-center justify-center space-x-1">
                              <span>❓</span>
                              <span>{island.questions} câu hỏi</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {isCurrent && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartLesson(island);
                            }}
                            className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all w-full"
                          >
                            Khám Phá 🚀
                          </motion.button>
                        )}
                        
                        {isConquered && (
                          <div className="mt-4 text-green-600 font-medium text-sm">
                            ✅ Đã Chinh Phục
                          </div>
                        )}
                        
                        {isLocked && (
                          <div className="mt-4 text-gray-400 text-sm">
                            🔒 Chờ mở khóa
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Island Details */}
        {currentIsland !== null && (
          <div className="p-6 border-t bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">
                  {islands[currentIsland].name}
                </h4>
                <p className="text-gray-600">
                  {islands[currentIsland].description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>⏰ {islands[currentIsland].duration}</span>
                  {islands[currentIsland].words && <span>📖 {islands[currentIsland].words} từ</span>}
                  {islands[currentIsland].questions && <span>❓ {islands[currentIsland].questions} câu hỏi</span>}
                </div>
              </div>
              
              {getIslandStatus(islands[currentIsland]) === "current" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStartLesson(islands[currentIsland])}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
                >
                  Bắt Đầu Hành Trình 🏃‍♂️
                </motion.button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="p-6 border-t bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-gray-800">Hành Trình Đại Dương</h4>
              <p className="text-gray-600 text-sm">Khám phá từng hòn đảo để làm chủ {topic.title}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setCurrentIsland(Math.max(0, currentIsland - 1))}
                disabled={currentIsland === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Đảo Trước
              </button>
              <button
                onClick={() => setCurrentIsland(Math.min(islands.length - 1, currentIsland + 1))}
                disabled={currentIsland === islands.length - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đảo Tiếp →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}