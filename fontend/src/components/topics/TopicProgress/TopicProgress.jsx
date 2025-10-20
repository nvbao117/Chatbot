"use client"

import styles from "./TopicProgress.module.css"

export const TopicProgress = ({ topic }) => {
  const progress = Math.round((topic.completedLessons / topic.totalLessons) * 100)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{topic.title}</h3>
        <span className={styles.percentage}>{progress}%</span>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.fill} style={{ width: `${progress}%` }}></div>
      </div>

      <div className={styles.details}>
        <p className={styles.text}>
          {topic.completedLessons} of {topic.totalLessons} lessons completed
        </p>
      </div>
    </div>
  )
}
