"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LessonTopics({ onClose, onSelectTopic }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = [
    { id: "basic", name: "🟡 Cơ bản", color: "from-yellow-400 to-yellow-600" },
    { id: "communication", name: "🔵 Giao tiếp", color: "from-blue-400 to-blue-600" },
    { id: "work", name: "🟢 Công việc", color: "from-green-400 to-green-600" },
    { id: "travel", name: "🟣 Du lịch", color: "from-purple-400 to-purple-600" },
    { id: "culture", name: "🔴 Văn hóa", color: "from-red-400 to-red-600" },
  ];

  const topics = [
    {
      id: 1,
      title: "Chào hỏi cơ bản",
      description: "Học cách chào hỏi và giới thiệu bản thân",
      level: "Mới bắt đầu",
      words: 15,
      time: "10 phút",
      category: "basic",
      icon: "👋"
    },
    {
      id: 2,
      title: "Gia đình & Bạn bè",
      description: "Từ vựng về các mối quan hệ",
      level: "Cơ bản",
      words: 20,
      time: "15 phút",
      category: "basic",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      id: 3,
      title: "Mua sắm",
      description: "Từ vựng mua sắm và trả giá",
      level: "Cơ bản",
      words: 25,
      time: "20 phút",
      category: "communication",
      icon: "🛍️"
    },
    {
      id: 4,
      title: "Nhà hàng & Ăn uống",
      description: "Gọi món và giao tiếp trong nhà hàng",
      level: "Trung cấp",
      words: 30,
      time: "25 phút",
      category: "communication",
      icon: "🍽️"
    },
    {
      id: 5,
      title: "Email công việc",
      description: "Viết email chuyên nghiệp",
      level: "Trung cấp",
      words: 35,
      time: "30 phút",
      category: "work",
      icon: "📧"
    },
    {
      id: 6,
      title: "Thuyết trình",
      description: "Từ vựng thuyết trình và họp",
      level: "Nâng cao",
      words: 40,
      time: "35 phút",
      category: "work",
      icon: "📊"
    },
    {
      id: 7,
      title: "Sân bay & Khách sạn",
      description: "Giao tiếp khi du lịch",
      level: "Cơ bản",
      words: 25,
      time: "20 phút",
      category: "travel",
      icon: "✈️"
    },
    {
      id: 8,
      title: "Phương hướng & Địa điểm",
      description: "Hỏi và chỉ đường",
      level: "Cơ bản",
      words: 20,
      time: "15 phút",
      category: "travel",
      icon: "🗺️"
    },
    {
      id: 9,
      title: "Lễ hội & Truyền thống",
      description: "Tìm hiểu văn hóa các nước",
      level: "Trung cấp",
      words: 30,
      time: "25 phút",
      category: "culture",
      icon: "🎎"
    },
    {
      id: 10,
      title: "Thành ngữ thông dụng",
      description: "Các thành ngữ hay dùng",
      level: "Nâng cao",
      words: 25,
      time: "30 phút",
      category: "culture",
      icon: "💬"
    }
  ];

  const filteredTopics = selectedCategory === "all" 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">📚</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Bài học & Chủ đề</h2>
                <p className="text-yellow-100">Chọn chủ đề bạn muốn học</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
            >
              🌟 Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                    : "bg-white text-gray-700 border hover:bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTopic(topic)}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-yellow-400 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{topic.icon}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    topic.level === "Mới bắt đầu" ? "bg-green-100 text-green-800" :
                    topic.level === "Cơ bản" ? "bg-blue-100 text-blue-800" :
                    topic.level === "Trung cấp" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {topic.level}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-yellow-600 transition-colors mb-2">
                  {topic.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {topic.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                      </svg>
                      {topic.words} từ
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {topic.time}
                    </span>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Bắt đầu
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Tiến độ học tập: 3/10 chủ đề</span>
            <span className="font-medium">30% hoàn thành</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '30%' }}
            ></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}