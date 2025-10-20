import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { Card, Button } from "@/components/common"
import { ROLES, PERMISSIONS, hasPermission } from "../../utils/roles"
import styles from "./AdminDashboard.module.css"

export const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalSubjects: 0,
    activeUsers: 0
  })

  // Mock data loading
  useEffect(() => {
    const loadStats = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        totalUsers: 1250,
        totalQuizzes: 45,
        totalSubjects: 12,
        activeUsers: 890
      })
    }
    loadStats()
  }, [])

  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: "👥",
      permission: PERMISSIONS.MANAGE_USERS,
      path: "/admin/users"
    },
    {
      title: "Content Management", 
      description: "Manage subjects, topics, and learning materials",
      icon: "📚",
      permission: PERMISSIONS.MANAGE_CONTENT,
      path: "/admin/content"
    },
    {
      title: "Analytics & Reports",
      description: "View system analytics and generate reports",
      icon: "📊",
      permission: PERMISSIONS.VIEW_ANALYTICS,
      path: "/admin/analytics"
    },
    {
      title: "Quiz Management",
      description: "Create and manage quizzes and questions",
      icon: "✏️",
      permission: PERMISSIONS.MANAGE_QUIZZES,
      path: "/admin/quizzes"
    },
    {
      title: "System Settings",
      description: "Configure system settings and preferences",
      icon: "⚙️",
      permission: PERMISSIONS.MANAGE_SETTINGS,
      path: "/admin/settings"
    },
    {
      title: "System Logs",
      description: "View system logs and activity history",
      icon: "📋",
      permission: PERMISSIONS.VIEW_LOGS,
      path: "/admin/logs"
    }
  ]

  const recentActivities = [
    { id: 1, action: "New user registered", user: "john.doe@example.com", time: "2 minutes ago" },
    { id: 2, action: "Quiz created", user: "teacher@example.com", time: "15 minutes ago" },
    { id: 3, action: "Subject updated", user: "admin@example.com", time: "1 hour ago" },
    { id: 4, action: "User role changed", user: "admin@example.com", time: "2 hours ago" },
    { id: 5, action: "System backup completed", user: "System", time: "3 hours ago" }
  ]

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.role}>👑 {user?.role?.toUpperCase()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.totalUsers.toLocaleString()}</h3>
            <p className={styles.statLabel}>Total Users</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>✏️</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.totalQuizzes}</h3>
            <p className={styles.statLabel}>Total Quizzes</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.totalSubjects}</h3>
            <p className={styles.statLabel}>Subjects</p>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statIcon}>🟢</div>
          <div className={styles.statContent}>
            <h3 className={styles.statNumber}>{stats.activeUsers}</h3>
            <p className={styles.statLabel}>Active Users</p>
          </div>
        </Card>
      </div>

      {/* Admin Features */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Admin Features</h2>
        <div className={styles.featuresGrid}>
          {adminFeatures.map((feature) => (
            <Card 
              key={feature.title} 
              className={`${styles.featureCard} ${
                hasPermission(user?.role, feature.permission) ? styles.enabled : styles.disabled
              }`}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <Button 
                variant={hasPermission(user?.role, feature.permission) ? "primary" : "outline"}
                disabled={!hasPermission(user?.role, feature.permission)}
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => {
                  if (hasPermission(user?.role, feature.permission)) {
                    alert(`${feature.title} feature will be implemented!`)
                  }
                }}
              >
                {hasPermission(user?.role, feature.permission) ? 'Access' : 'No Permission'}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Activities</h2>
        <Card className={styles.activitiesCard}>
          <div className={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{activity.action}</p>
                  <p className={styles.activityUser}>by {activity.user}</p>
                </div>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
