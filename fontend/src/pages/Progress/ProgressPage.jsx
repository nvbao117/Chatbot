import { useState, useEffect } from "react"
import { Card, Loading } from "@/components/common"
import styles from "./ProgressPage.module.css"

export const ProgressPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return <Loading fullScreen message="Loading progress..." />
  }

  const periods = [
    { id: "week", name: "Tuần này", icon: "📅" },
    { id: "month", name: "Tháng này", icon: "📆" },
    { id: "year", name: "Năm nay", icon: "🗓️" },
    { id: "all", name: "Tất cả", icon: "📊" }
  ]

  const mockStats = {
    week: { completed: 12, total: 20, hours: 15, streak: 5 },
    month: { completed: 45, total: 80, hours: 60, streak: 12 },
    year: { completed: 180, total: 300, hours: 240, streak: 25 },
    all: { completed: 250, total: 400, hours: 320, streak: 30 }
  }

  const currentStats = mockStats[selectedPeriod]

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>📈 Learning Progress</h1>
          <p className={styles.subtitle}>Track your learning journey and achievements</p>
        </div>
        
        <div className={styles.periodSelector}>
          {periods.map((period) => (
            <button
              key={period.id}
              className={`${styles.periodButton} ${selectedPeriod === period.id ? styles.active : ''}`}
              onClick={() => setSelectedPeriod(period.id)}
            >
              <span className={styles.periodIcon}>{period.icon}</span>
              <span className={styles.periodName}>{period.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{currentStats.completed}</h3>
            <p className={styles.statLabel}>Hoàn thành</p>
            <p className={styles.statSubtext}>trong {currentStats.total} bài</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>⏱️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{currentStats.hours}h</h3>
            <p className={styles.statLabel}>Thời gian học</p>
            <p className={styles.statSubtext}>tổng cộng</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{currentStats.streak}</h3>
            <p className={styles.statLabel}>Ngày liên tiếp</p>
            <p className={styles.statSubtext}>streak hiện tại</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>
              {Math.round((currentStats.completed / currentStats.total) * 100)}%
            </h3>
            <p className={styles.statLabel}>Tiến độ</p>
            <p className={styles.statSubtext}>tổng thể</p>
          </div>
        </Card>
      </div>

      {/* Progress Chart Placeholder */}
      <Card className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Biểu đồ tiến độ</h2>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#667eea' }}></div>
              <span>Hoàn thành</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#e5e7eb' }}></div>
              <span>Chưa hoàn thành</span>
            </div>
          </div>
        </div>
        <div className={styles.chartPlaceholder}>
          <div className={styles.chartIcon}>📊</div>
          <p>Biểu đồ tiến độ sẽ được hiển thị ở đây</p>
        </div>
      </Card>

      {/* Topic Progress */}
      <div className={styles.progressSection}>
        <h2 className={styles.sectionTitle}>Chi tiết tiến độ</h2>
        <div className={styles.topicProgressPlaceholder}>
          <div className={styles.placeholderIcon}>📊</div>
          <p>Chi tiết tiến độ từng môn học sẽ được hiển thị ở đây</p>
        </div>
      </div>
    </div>
  )
}

export default ProgressPage