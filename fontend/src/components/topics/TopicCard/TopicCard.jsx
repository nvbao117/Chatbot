"use client"

import { useNavigate } from "react-router-dom"
import { Card } from "@/components/common"
import { calculatePercentage } from "../../../utils/helpers"
import styles from "./TopicCard.module.css"

export const TopicCard = ({ topic, onClick }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick(topic)
    } else {
      navigate(`/topics/${topic.id}`)
    }
  }

  const progress = calculatePercentage(topic.completedLessons || 0, topic.totalLessons || 1)

  return (
    <Card hoverable onClick={handleClick} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{topic.title}</h3>
        <span className={styles.badge}>{topic.difficulty || "Medium"}</span>
      </div>

      <p className={styles.description}>{topic.description}</p>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        <span className={styles.progressText}>{progress}% Complete</span>
      </div>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <strong>{topic.totalLessons || 0}</strong> Lessons
        </span>
        <span className={styles.metaItem}>
          <strong>{topic.estimatedTime || 0}</strong> mins
        </span>
      </div>
    </Card>
  )
}
