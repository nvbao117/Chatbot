/**
 * Header Component
 * 
 * Component header chính của ứng dụng với các tính năng:
 * - Logo và branding
 * - Navigation menu với icons
 * - Chat button
 * - User dropdown menu với avatar
 * - Scroll effect (thay đổi style khi scroll)
 * - Responsive design
 * - Theme toggle (dark/light mode)
 * - Notifications indicator
 */

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../hooks"
import { Button } from "../Button"
import styles from "./Header.module.css"

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  
  // State quản lý UI
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // Effect theo dõi scroll để thay đổi style header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Effect đóng user menu khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(`.${styles.userMenu}`)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  // Function xử lý logout
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Function toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Có thể thêm logic lưu theme vào localStorage
  }

  // Function toggle notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  // Navigation items với active state
  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Subjects", href: "/subjects", icon: "📚" },
    { label: "Quiz", href: "/quiz", icon: "🧠" },
    { label: "Progress", href: "/progress", icon: "📈" },
    { label: "Achievements", href: "/achievements", icon: "🏆" }
  ]

  // Check if current route is active
  const isActiveRoute = (href) => {
    return location.pathname === href
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.container}>
        {/* Logo Section */}
        <div className={styles.logo} onClick={() => navigate('/dashboard')}>
          <div className={styles.logoIcon}>🎓</div>
          <h1 className={styles.title}>EduLearn</h1>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={`${styles.navLink} ${isActiveRoute(item.href) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Actions Section */}
        <div className={styles.actions}>
          {/* Theme Toggle */}
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className={styles.themeIcon}>
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>

          {/* Notifications */}
          <div className={styles.notifications}>
            <button 
              className={styles.notificationButton}
              onClick={toggleNotifications}
              title="Notifications"
            >
              <span className={styles.notificationIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
            
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h3>Notifications</h3>
                  <button className={styles.markAllRead}>Mark all read</button>
                </div>
                <div className={styles.notificationList}>
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationIcon}>🎉</div>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTitle}>Achievement Unlocked!</div>
                      <div className={styles.notificationText}>You completed 5 quizzes</div>
                    </div>
                  </div>
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationIcon}>📚</div>
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationTitle}>New Subject Available</div>
                      <div className={styles.notificationText}>Mathematics course is ready</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Button */}
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => navigate('/chat')}
            className={styles.chatButton}
          >
            <span className={styles.buttonIcon}>💬</span>
            <span>Chat</span>
          </Button>
          
          {/* User Menu */}
          <div className={styles.userMenu}>
            <button 
              className={styles.userButton}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className={styles.userAvatar}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.username || 'User'}</span>
                <span className={styles.userRole}>{user?.role || 'Student'}</span>
              </div>
              <span className={styles.dropdownIcon}>▼</span>
            </button>
            
            {showUserMenu && (
              <div className={styles.userDropdown}>
                <div className={styles.userProfile}>
                  <div className={styles.userProfileAvatar}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      <span>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className={styles.userProfileInfo}>
                    <div className={styles.userProfileName}>{user?.name || user?.username}</div>
                    <div className={styles.userProfileEmail}>{user?.email}</div>
                    <div className={styles.userProfileRole}>{user?.role || 'Student'}</div>
                  </div>
                </div>
                <div className={styles.userActions}>
                  <button 
                    className={styles.userAction}
                    onClick={() => {
                      navigate('/profile')
                      setShowUserMenu(false)
                    }}
                  >
                    <span className={styles.actionIcon}>👤</span>
                    Profile
                  </button>
                  <button 
                    className={styles.userAction}
                    onClick={() => {
                      navigate('/settings')
                      setShowUserMenu(false)
                    }}
                  >
                    <span className={styles.actionIcon}>⚙️</span>
                    Settings
                  </button>
                  {user?.role === 'admin' && (
                    <button 
                      className={styles.userAction}
                      onClick={() => {
                        navigate('/admin')
                        setShowUserMenu(false)
                      }}
                    >
                      <span className={styles.actionIcon}>👑</span>
                      Admin Panel
                    </button>
                  )}
                  <div className={styles.userActionDivider}></div>
                  <button 
                    className={`${styles.userAction} ${styles.logoutAction}`}
                    onClick={handleLogout}
                  >
                    <span className={styles.actionIcon}>🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
