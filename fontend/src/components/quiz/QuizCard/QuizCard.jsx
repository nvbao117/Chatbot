import { useNavigate } from "react-router-dom"
import { Card, Button } from "@/components/common"
import { formatTime } from "../../../utils/helpers"
import styles from "./QuizCard.module.css"

export const QuizCard = ({ quiz }) => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate(`/quiz/${quiz.id}`)
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{quiz.title}</h3>
        <span className={`${styles.difficulty} ${styles[`difficulty-${quiz.difficulty}`]}`}>{quiz.difficulty}</span>
      </div>

      <p className={styles.description}>{quiz.description}</p>

      <div className={styles.info}>
        <span className={styles.infoItem}>
          <strong>{quiz.questionCount}</strong> Questions
        </span>
        <span className={styles.infoItem}>
          <strong>{formatTime(quiz.timeLimit)}</strong> Time
        </span>
        <span className={styles.infoItem}>
          <strong>{quiz.passingScore}%</strong> Pass
        </span>
      </div>

      <Button onClick={handleStart} className={styles.button}>
        Start Quiz
      </Button>
    </Card>
  )
}
