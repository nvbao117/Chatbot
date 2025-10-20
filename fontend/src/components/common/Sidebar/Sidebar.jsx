import { useSelector, useDispatch } from "react-redux"
import { toggleSidebar } from "../../../store/slices/uiSlice"
import { useAuth } from "../../../hooks/useAuth"
import { isAdmin } from "../../../utils/roles"
import styles from "./Sidebar.module.css"

export const Sidebar = () => {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const { user } = useAuth()

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊", color: "#667eea" },
    { label: "Subjects", href: "/subjects", icon: "📚", color: "#764ba2" },
    { label: "Quiz", href: "/quiz", icon: "✏️", color: "#f093fb" },
    { label: "Progress", href: "/progress", icon: "📈", color: "#4ecdc4" },
    { label: "Achievements", href: "/achievements", icon: "🏆", color: "#45b7d1" },
    { label: "Chat", href: "/chat", icon: "💬", color: "#96ceb4" },
    { label: "Profile", href: "/profile", icon: "👤", color: "#feca57" },
  ]

  // Add admin menu if user is admin
  if (isAdmin(user?.role)) {
    menuItems.splice(6, 0, { 
      label: "Admin", 
      href: "/admin", 
      icon: "👑",
      color: "#ff6b6b",
      isAdmin: true 
    })
  }

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
      <button className={styles.toggleBtn} onClick={() => dispatch(toggleSidebar())} title={sidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}>
        {sidebarOpen ? "◀" : "▶"}
      </button>

          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className={`${styles.navItem} ${item.isAdmin ? styles.admin : ''}`}
                title={sidebarOpen ? "" : item.label}
                style={{ '--item-color': item.color }}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </a>
            ))}
          </nav>
    </aside>
  )
}
