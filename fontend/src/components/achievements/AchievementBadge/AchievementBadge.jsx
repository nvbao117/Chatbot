"use client"

import styles from "./AchievementBadge.module.css"

export const AchievementBadge = ({ achievement, unlocked = false }) => {
  return (
    <div className={`${styles.badge} ${unlocked ? styles.unlocked : styles.locked}`}>
      <div className={styles.icon}>{achievement.icon}</div>
      <h4 className={styles.name}>{achievement.name}</h4>
      <p className={styles.description}>{achievement.description}</p>
      {!unlocked && <div className={styles.overlay}>Locked</div>}
    </div>
  )
}
