import { useState, useEffect } from "react"
import { Card } from "@/components/common"
import styles from "./Dashboard.module.css"

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPoints: 0,
    quizzesDone: 0,
    dayStreak: 0,
    subjectsCompleted: 0
  })

  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        totalPoints: 1250,
        quizzesDone: 12,
        dayStreak: 5,
        subjectsCompleted: 3
      })
      setRecentActivities([
        { id: 1, action: "Completed Math Quiz", time: "2 hours ago", icon: "🧮" },
        { id: 2, action: "Earned Achievement", time: "1 day ago", icon: "🏆" },
        { id: 3, action: "Started Physics Course", time: "2 days ago", icon: "⚡" },
        { id: 4, action: "Perfect Score on Chemistry", time: "3 days ago", icon: "🧪" }
      ])
    }
    loadData()
  }, [])

  const achievements = [
    { id: 1, name: "First Steps", icon: "🎯", description: "Complete your first quiz", unlocked: true },
    { id: 2, name: "Streak Master", icon: "🔥", description: "Study for 7 days in a row", unlocked: true },
    { id: 3, name: "Math Wizard", icon: "🧮", description: "Score 100% on 5 math quizzes", unlocked: false },
    { id: 4, name: "Quick Learner", icon: "⚡", description: "Complete 10 quizzes in one day", unlocked: false }
  ]

  const quickActions = [
    { title: "Start Quiz", description: "Take a practice quiz", icon: "✏️", color: "#667eea", href: "/quiz" },
    { title: "Browse Subjects", description: "Explore learning materials", icon: "📚", color: "#764ba2", href: "/subjects" },
    { title: "View Progress", description: "Check your learning stats", icon: "📈", color: "#f093fb", href: "/progress" },
    { title: "AI Chat", description: "Get help from AI assistant", icon: "🤖", color: "#4ecdc4", href: "/chat" }
  ]

  return (
    <div className={styles.dashboard}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Welcome back! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            Ready to continue your learning journey?
          </p>
        </div>
        <div className={styles.welcomeActions}>
          <button className={styles.primaryButton}>
            🚀 Start Learning
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.totalPoints.toLocaleString()}</h3>
            <p className={styles.statLabel}>Total Points</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>✏️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.quizzesDone}</h3>
            <p className={styles.statLabel}>Quizzes Done</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.dayStreak}</h3>
            <p className={styles.statLabel}>Day Streak</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.subjectsCompleted}</h3>
            <p className={styles.statLabel}>Subjects Completed</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Quick Actions */}
        <Card className={styles.quickActionsCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <p className={styles.cardSubtitle}>Jump into learning</p>
          </div>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <a
                key={action.title}
                href={action.href}
                className={styles.quickAction}
                style={{ '--action-color': action.color }}
              >
                <div className={styles.actionIcon}>{action.icon}</div>
                <div className={styles.actionContent}>
                  <h3 className={styles.actionTitle}>{action.title}</h3>
                  <p className={styles.actionDescription}>{action.description}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card className={styles.achievementsCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Achievements</h2>
            <p className={styles.cardSubtitle}>Your accomplishments</p>
          </div>
          <div className={styles.achievementsList}>
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`${styles.achievementItem} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.achievementIcon}>{achievement.icon}</div>
                <div className={styles.achievementContent}>
                  <h3 className={styles.achievementName}>{achievement.name}</h3>
                  <p className={styles.achievementDescription}>{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className={styles.achievementBadge}>✓</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className={styles.activitiesCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Activities</h2>
          <p className={styles.cardSubtitle}>Your learning journey</p>
        </div>
        <div className={styles.activitiesList}>
          {recentActivities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>{activity.icon}</div>
              <div className={styles.activityContent}>
                <p className={styles.activityAction}>{activity.action}</p>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard