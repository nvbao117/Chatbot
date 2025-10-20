import { useNavigate } from "react-router-dom"
import { Card } from "@/components/common"
import styles from "./SubjectCard.module.css"

export const SubjectCard = ({ subject, onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick(subject)
    } else {
      navigate(`/subjects/${subject.id}`)
    }
  }

  return (
    <Card hoverable onClick={handleClick} className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: subject.color }}>
        {subject.icon}
      </div>
      <h3 className={styles.name}>{subject.name}</h3>
      <p className={styles.description}>{subject.description || "Learn this subject"}</p>
      <div className={styles.stats}>
        <span className={styles.stat}>
          <strong>{subject.topicCount || 0}</strong> Topics
        </span>
        <span className={styles.stat}>
          <strong>{subject.progress || 0}%</strong> Complete
        </span>
      </div>
    </Card>
  )
}
