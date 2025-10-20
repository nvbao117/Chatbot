import { useState } from "react"
import { Button, Card } from "@/components/common"
import styles from "./QuizPage.module.css"

export const QuizPage = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const mockQuizzes = [
    {
      id: 1,
      title: "Toán học cơ bản",
      description: "Kiểm tra kiến thức toán học cơ bản",
      questions: 10,
      timeLimit: 30,
      difficulty: "Dễ",
      subject: "Toán học",
      icon: "🧮",
      color: "#667eea",
      completed: true,
      score: 85
    },
    {
      id: 2,
      title: "Vật lý - Cơ học",
      description: "Bài kiểm tra về các khái niệm cơ học",
      questions: 15,
      timeLimit: 45,
      difficulty: "Trung bình",
      subject: "Vật lý",
      icon: "⚡",
      color: "#764ba2",
      completed: false,
      score: null
    },
    {
      id: 3,
      title: "Hóa học - Hữu cơ",
      description: "Kiểm tra kiến thức hóa học hữu cơ",
      questions: 20,
      timeLimit: 60,
      difficulty: "Khó",
      subject: "Hóa học",
      icon: "🧪",
      color: "#f093fb",
      completed: false,
      score: null
    },
    {
      id: 4,
      title: "Lịch sử Việt Nam",
      description: "Kiểm tra kiến thức lịch sử Việt Nam",
      questions: 12,
      timeLimit: 25,
      difficulty: "Dễ",
      subject: "Lịch sử",
      icon: "🌍",
      color: "#4ecdc4",
      completed: true,
      score: 92
    },
    {
      id: 5,
      title: "Tiếng Anh - Ngữ pháp",
      description: "Bài kiểm tra ngữ pháp tiếng Anh",
      questions: 18,
      timeLimit: 40,
      difficulty: "Trung bình",
      subject: "Tiếng Anh",
      icon: "📝",
      color: "#45b7d1",
      completed: false,
      score: null
    },
    {
      id: 6,
      title: "Sinh học - Tế bào",
      description: "Kiểm tra kiến thức về tế bào",
      questions: 14,
      timeLimit: 35,
      difficulty: "Trung bình",
      subject: "Sinh học",
      icon: "🔬",
      color: "#96ceb4",
      completed: true,
      score: 78
    }
  ]

  const difficulties = [
    { id: "all", name: "Tất cả", color: "#667eea" },
    { id: "Dễ", name: "Dễ", color: "#4ecdc4" },
    { id: "Trung bình", name: "Trung bình", color: "#feca57" },
    { id: "Khó", name: "Khó", color: "#ff6b6b" }
  ]

  const subjects = [
    { id: "all", name: "Tất cả", icon: "📚" },
    { id: "Toán học", name: "Toán học", icon: "🧮" },
    { id: "Vật lý", name: "Vật lý", icon: "⚡" },
    { id: "Hóa học", name: "Hóa học", icon: "🧪" },
    { id: "Lịch sử", name: "Lịch sử", icon: "🌍" },
    { id: "Tiếng Anh", name: "Tiếng Anh", icon: "📝" },
    { id: "Sinh học", name: "Sinh học", icon: "🔬" }
  ]

  const stats = [
    { label: "Tổng Quiz", value: mockQuizzes.length, icon: "📊" },
    { label: "Đã hoàn thành", value: mockQuizzes.filter(q => q.completed).length, icon: "✅" },
    { label: "Chưa làm", value: mockQuizzes.filter(q => !q.completed).length, icon: "⏳" },
    { label: "Điểm TB", value: "85%", icon: "⭐" }
  ]

  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty
    const matchesSubject = selectedSubject === "all" || quiz.subject === selectedSubject
    
    return matchesSearch && matchesDifficulty && matchesSubject
  })

  const getDifficultyColor = (difficulty) => {
    const diff = difficulties.find(d => d.id === difficulty)
    return diff ? diff.color : "#667eea"
  }

  if (selectedQuiz) {
    return (
      <div className={styles.quizDetail}>
        <div className={styles.quizHeader}>
          <button 
            className={styles.backButton}
            onClick={() => setSelectedQuiz(null)}
          >
            ← Quay lại
          </button>
          <div className={styles.quizInfo}>
            <div className={styles.quizIcon}>{selectedQuiz.icon}</div>
            <div>
              <h1 className={styles.quizTitle}>{selectedQuiz.title}</h1>
              <p className={styles.quizDescription}>{selectedQuiz.description}</p>
            </div>
          </div>
        </div>

        <div className={styles.quizDetails}>
          <div className={styles.detailGrid}>
            <Card className={styles.detailCard}>
              <div className={styles.detailIcon}>❓</div>
              <div className={styles.detailContent}>
                <h3>{selectedQuiz.questions}</h3>
                <p>Câu hỏi</p>
              </div>
            </Card>
            
            <Card className={styles.detailCard}>
              <div className={styles.detailIcon}>⏱️</div>
              <div className={styles.detailContent}>
                <h3>{selectedQuiz.timeLimit}</h3>
                <p>Phút</p>
              </div>
            </Card>
            
            <Card className={styles.detailCard}>
              <div className={styles.detailIcon}>📊</div>
              <div className={styles.detailContent}>
                <h3 style={{ color: getDifficultyColor(selectedQuiz.difficulty) }}>
                  {selectedQuiz.difficulty}
                </h3>
                <p>Độ khó</p>
              </div>
            </Card>
            
            <Card className={styles.detailCard}>
              <div className={styles.detailIcon}>📚</div>
              <div className={styles.detailContent}>
                <h3>{selectedQuiz.subject}</h3>
                <p>Môn học</p>
              </div>
            </Card>
          </div>

          {selectedQuiz.completed && (
            <Card className={styles.scoreCard}>
              <div className={styles.scoreHeader}>
                <h3>Kết quả gần nhất</h3>
                <div className={styles.scoreValue}>{selectedQuiz.score}%</div>
              </div>
              <div className={styles.scoreBar}>
                <div 
                  className={styles.scoreProgress}
                  style={{ width: `${selectedQuiz.score}%` }}
                />
              </div>
            </Card>
          )}

          <div className={styles.quizActions}>
            <Button 
              className={styles.startButton}
              style={{ '--quiz-color': selectedQuiz.color }}
            >
              {selectedQuiz.completed ? 'Làm lại' : 'Bắt đầu Quiz'}
            </Button>
            <Button variant="outline">
              Xem trước câu hỏi
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>✏️ Quiz Center</h1>
          <p className={styles.subtitle}>Test your knowledge and track your progress</p>
        </div>
        
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <h3>Độ khó:</h3>
          <div className={styles.filterButtons}>
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                className={`${styles.filterButton} ${selectedDifficulty === diff.id ? styles.active : ''}`}
                onClick={() => setSelectedDifficulty(diff.id)}
                style={{ '--filter-color': diff.color }}
              >
                {diff.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3>Môn học:</h3>
          <div className={styles.subjectFilters}>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                className={`${styles.subjectFilter} ${selectedSubject === subject.id ? styles.active : ''}`}
                onClick={() => setSelectedSubject(subject.id)}
              >
                <span className={styles.subjectIcon}>{subject.icon}</span>
                <span>{subject.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className={styles.quizzesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {filteredQuizzes.length} Quiz được tìm thấy
          </h2>
        </div>
        
        <div className={styles.quizGrid}>
          {filteredQuizzes.map((quiz) => (
            <Card 
              key={quiz.id} 
              className={styles.quizCard}
              onClick={() => setSelectedQuiz(quiz)}
              hoverable
            >
              <div className={styles.quizCardHeader}>
                <div className={styles.quizCardIcon} style={{ color: quiz.color }}>
                  {quiz.icon}
                </div>
                <div className={styles.quizCardStatus}>
                  {quiz.completed ? (
                    <span className={styles.completedBadge}>✅ Hoàn thành</span>
                  ) : (
                    <span className={styles.pendingBadge}>⏳ Chưa làm</span>
                  )}
                </div>
              </div>
              
              <div className={styles.quizCardContent}>
                <h3 className={styles.quizCardTitle}>{quiz.title}</h3>
                <p className={styles.quizCardDescription}>{quiz.description}</p>
                
                <div className={styles.quizCardDetails}>
                  <div className={styles.quizDetail}>
                    <span className={styles.detailIcon}>❓</span>
                    <span>{quiz.questions} câu</span>
                  </div>
                  <div className={styles.quizDetail}>
                    <span className={styles.detailIcon}>⏱️</span>
                    <span>{quiz.timeLimit} phút</span>
                  </div>
                  <div className={styles.quizDetail}>
                    <span className={styles.detailIcon}>📊</span>
                    <span style={{ color: getDifficultyColor(quiz.difficulty) }}>
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>

                {quiz.completed && (
                  <div className={styles.quizScore}>
                    <span>Điểm: </span>
                    <span className={styles.scoreValue}>{quiz.score}%</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizPage