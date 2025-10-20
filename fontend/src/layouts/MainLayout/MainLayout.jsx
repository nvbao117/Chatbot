import { Header } from "../../components/common/Header/Header"
import { Sidebar } from "../../components/common/Sidebar/Sidebar"
import { ChatWidget } from "../../components/chatbot/ChatWidget"
import styles from "./MainLayout.module.css"

export const MainLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
      <ChatWidget />
    </div>
  )
}
