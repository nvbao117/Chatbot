"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LessonTopics from "./LessonTopics";
import IslandRoadmap from "./IslandRoadmap";
import VocabularyLesson from "./lessons/VocabularyLesson"; // Thêm import
import GrammarLesson from "./lessons/GrammarLesson"; // Thêm import

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLessonTopics, setShowLessonTopics] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showLessonRoadmap, setShowLessonRoadmap] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null); // Thêm state mới
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Thêm phần hiển thị bài học thực tế
  if (currentLesson) {
    if (currentLesson.type === "vocabulary") {
      return (
        <VocabularyLesson 
          lesson={currentLesson.data}
          onComplete={() => {
            setCurrentLesson(null);
            setShowLessonRoadmap(true);
          }}
          onBack={() => {
            setCurrentLesson(null);
            setShowLessonRoadmap(true);
          }}
        />
      );
    } else if (currentLesson.type === "grammar") {
      return (
        <GrammarLesson 
          lesson={currentLesson.data}
          onComplete={() => {
            setCurrentLesson(null);
            setShowLessonRoadmap(true);
          }}
          onBack={() => {
            setCurrentLesson(null);
            setShowLessonRoadmap(true);
          }}
        />
      );
    }
  }

  const menuItems = [
    { id: 1, name: "📚 Bài học & Chủ đề", icon: "📚", description: "Học từ vựng theo chủ đề" },
    { id: 2, name: "🧠 Quiz & Kiểm tra", icon: "🧠", description: "Luyện tập với bài test" },
    { id: 3, name: "📊 Thống kê kết quả", icon: "📊", description: "Theo dõi tiến độ học" },
    { id: 4, name: "📖 Đọc truyện & Sách", icon: "📖", description: "Tăng vốn từ qua đọc" },
    { id: 5, name: "🔤 Ngữ pháp", icon: "🔤", description: "Học ngữ pháp cơ bản" },
    { id: 6, name: "🎤 Luyện nghe & Nói", icon: "🎤", description: "Trò chuyện với AI" },
    { id: 7, name: "🎯 Nhiệm vụ hàng ngày", icon: "🎯", description: "Giữ thói quen học" },
    { id: 8, name: "👤 Tài khoản", icon: "👤", description: "Quản lý thông tin" },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      role: "user", 
      content: input,
      timestamp: new Date(),
      id: Date.now()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { 
        role: "bot", 
        content: data.reply,
        timestamp: new Date(),
        id: Date.now() + 1
      };

      // Hiệu ứng gõ chữ mượt mà hơn
      let displayedText = "";
      const typingEffect = setInterval(() => {
        if (displayedText.length < botMessage.content.length) {
          displayedText = botMessage.content.slice(0, displayedText.length + 1);
          setMessages((prev) => {
            const otherMessages = prev.filter(m => m.role !== "bot-typing");
            return [...otherMessages, { 
              role: "bot-typing", 
              content: displayedText,
              timestamp: new Date(),
              id: "typing"
            }];
          });
        } else {
          clearInterval(typingEffect);
          setIsTyping(false);
          setMessages((prev) => [
            ...prev.filter((m) => m.role !== "bot-typing"),
            botMessage,
          ]);
        }
      }, 20); // Tốc độ gõ nhanh hơn
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "bot", 
          content: "⚠️ DuckBot đang bận, thử lại sau nhé!",
          timestamp: new Date(),
          id: Date.now()
        },
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMenuClick = (item) => {
    const menuMessage = { 
      role: "user", 
      content: `Tôi muốn sử dụng: ${item.name}`,
      timestamp: new Date(),
      id: Date.now()
    };
    setMessages((prev) => [...prev, menuMessage]);
    setShowMenu(false);
    
    if (item.id === 1) {
      setShowLessonTopics(true);
      return;
    }
    
    setIsTyping(true);
    setTimeout(() => {
      const responses = {
        2: "📝 Bạn muốn làm quiz về: Từ vựng, Ngữ pháp, hay Nghe hiểu?",
        3: "📈 Đây là thống kê học tập của bạn...",
        4: "📚 Mình có nhiều truyện ngắn và sách hay. Bạn thích chủ đề gì?",
        5: "🔤 Bạn muốn học ngữ pháp nào: Thì, Câu điều kiện, Mệnh đề quan hệ?",
        6: "🎤 Hãy bắt đầu trò chuyện! Mình sẽ giúp bạn luyện phát âm.",
        7: "🎯 Nhiệm vụ hôm nay: Học 10 từ mới và làm 1 quiz nhỏ!",
        8: "👤 Quản lý tài khoản: Cập nhật thông tin, mục tiêu học tập..."
      };
      
      const botMessage = { 
        role: "bot", 
        content: responses[item.id] || `Tính năng "${item.name}" đang được phát triển!`,
        timestamp: new Date(),
        id: Date.now()
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800); // Giảm thời gian chờ
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setShowLessonTopics(false);
    setShowLessonRoadmap(true);
    
    const topicMessage = { 
      role: "user", 
      content: `Tôi muốn học chủ đề: ${topic.title}`,
      timestamp: new Date(),
      id: Date.now()
    };
    setMessages((prev) => [...prev, topicMessage]);
  };

  // Sửa hàm handleStartLesson để chuyển đến bài học thực tế
  const handleStartLesson = (lessonStep) => {
    setShowLessonRoadmap(false);
    
    // Chuyển đến trang bài học thực tế thay vì chat
    if (lessonStep.type === "vocabulary" || lessonStep.type === "grammar") {
      setCurrentLesson({
        type: lessonStep.type,
        data: lessonStep
      });
    } else {
      // Giữ nguyên chat cho các loại bài học khác
      setIsTyping(true);
      setTimeout(() => {
        const lessonMessages = {
          "vocabulary": `🎯 Bắt đầu học **${lessonStep.name}**!\n\nHãy cùng học ${lessonStep.words} từ vựng về chủ đề này. Mình sẽ đưa ra từ mới, nghĩa và ví dụ cụ thể. Bạn sẵn sàng chưa?`,
          "grammar": `🔤 Bắt đầu học **${lessonStep.name}**!\n\nChúng ta sẽ học ${lessonStep.rules} cấu trúc ngữ pháp quan trọng. Mình sẽ giải thích rõ ràng kèm ví dụ thực tế.`,
          "quiz": `🧠 Bắt đầu **${lessonStep.name}**!\n\nBài quiz gồm ${lessonStep.questions} câu hỏi. Hãy chọn đáp án đúng nhất! Sẵn sàng chinh phục thử thách?`,
          "conversation": `💬 Bắt đầu **${lessonStep.name}**!\n\nChúng ta sẽ thực hành ${lessonStep.scenarios} tình huống giao tiếp thực tế. Mình sẽ đóng vai các nhân vật khác nhau!`,
          "test": `🏆 Bắt đầu **${lessonStep.name}**!\n\nBài kiểm tra cuối cùng gồm ${lessonStep.questions} câu hỏi tổng hợp. Hãy thể hiện những gì bạn đã học!`
        };
        
        const botMessage = { 
          role: "bot", 
          content: lessonMessages[lessonStep.type] || `Bắt đầu học: ${lessonStep.name}`,
          timestamp: new Date(),
          id: Date.now()
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 600);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex font-sans overflow-hidden">
      {/* Sidebar Menu */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: showMenu ? 0 : -320 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-80 bg-white/95 backdrop-blur-lg shadow-2xl p-6 overflow-y-auto fixed h-full z-50 border-r border-gray-200/50"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="text-3xl">🧭</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent ml-3">
            DuckBot Menu
          </h2>
        </div>
        
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleMenuClick(item)}
              className="w-full p-4 bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/60 rounded-2xl text-left cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-yellow-300/50 group"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl transform group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ${
        showMenu ? "ml-80" : "ml-0"
      }`}>
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 px-8 py-4 sticky top-0 z-40"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="relative"
              >
                <img
                  src="/images/duck_hello.jpg"
                  alt="DuckBot"
                  className="w-16 h-16 rounded-2xl border-4 border-yellow-400/80 shadow-lg"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  DuckBot Assistant
                </h1>
                <p className="text-gray-600 text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Đang trực tuyến - Sẵn sàng hỗ trợ
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f59e0b" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMenu(!showMenu)}
              className="px-6 py-3 bg-yellow-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <span>{showMenu ? "✕" : "☰"}</span>
              <span>{showMenu ? "Đóng" : "Menu"}</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-hidden">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center max-w-2xl">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-8xl mb-6"
                >
                  🦆
                </motion.div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                  Chào mừng đến với DuckBot!
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Mình là trợ lý học tập thông minh của bạn. Cùng khám phá thế giới ngôn ngữ qua những bài học thú vị nhé!
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <span>🎯</span>
                    <span>Học tập cá nhân hóa</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Tiến bộ nhanh chóng</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>🎮</span>
                    <span>Phương pháp tương tác</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>📊</span>
                    <span>Theo dõi tiến độ</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages Container */}
          {messages.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto space-y-4 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200/50 p-6 shadow-inner"
            >
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.role.startsWith("user") ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-end space-x-3 max-w-[80%]">
                      {!msg.role.startsWith("user") && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        >
                          🦆
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`relative rounded-3xl px-5 py-3 shadow-lg ${
                          msg.role.startsWith("user")
                            ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-br-md"
                            : "bg-white border border-gray-200/80 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed text-[15px]">
                          {msg.content}
                        </div>
                        
                        {/* Timestamp */}
                        <div className={`text-xs mt-2 ${
                          msg.role.startsWith("user") ? "text-yellow-100" : "text-gray-500"
                        }`}>
                          {formatTime(msg.timestamp)}
                        </div>

                        {/* Message tail */}
                        <div className={`absolute bottom-0 w-4 h-4 ${
                          msg.role.startsWith("user") 
                            ? "right-0 transform translate-x-1/2 bg-yellow-500 rounded-br-full"
                            : "left-0 transform -translate-x-1/2 bg-white border-l border-b border-gray-200/80 rounded-bl-full"
                        }`} />
                      </motion.div>

                      {msg.role.startsWith("user") && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        >
                          👤
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-end space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        🦆
                      </div>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity 
                        }}
                        className="bg-white border border-gray-200/80 rounded-3xl rounded-bl-md px-5 py-4 shadow-lg"
                      >
                        <div className="flex space-x-2">
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 bg-white/80 backdrop-blur-lg border-t border-gray-200/50"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4 items-end">
              <motion.div 
                whileFocus={{ scale: 1.02 }}
                className="flex-1 relative"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Nhập tin nhắn của bạn... (Shift + Enter để xuống dòng)"
                  rows={1}
                  className="w-full px-6 py-4 border-2 border-gray-300/80 rounded-2xl outline-none resize-none bg-white/90 backdrop-blur-sm shadow-lg focus:border-yellow-400 focus:shadow-xl transition-all duration-300 placeholder-gray-400 text-gray-800 pr-24"
                  style={{ minHeight: '60px', maxHeight: '120px' }}
                />
                <div className="absolute right-4 bottom-4 flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      input.trim() 
                        ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 hover:shadow-xl' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#f59e0b" }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2 ${
                  input.trim() 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-xl' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span>Gửi</span>
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🚀
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Lesson Topics Modal */}
      <AnimatePresence>
        {showLessonTopics && (
          <LessonTopics 
            onClose={() => setShowLessonTopics(false)}
            onSelectTopic={handleSelectTopic}
          />
        )}
      </AnimatePresence>

      {/* Island Roadmap Modal */}
      <AnimatePresence>
        {showLessonRoadmap && selectedTopic && (
          <IslandRoadmap 
            topic={selectedTopic}
            onClose={() => setShowLessonRoadmap(false)}
            onStartLesson={handleStartLesson}
          />
        )}
      </AnimatePresence>
    </div>
  );
}