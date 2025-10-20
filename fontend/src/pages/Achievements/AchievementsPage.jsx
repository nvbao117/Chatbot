import { useEffect } from "react"
import { useAchievements } from "../../hooks"
import { Loading } from "@/components/common"
import { AchievementBadge } from "../../components/achievements"
import styles from "./AchievementsPage.module.css"

export const AchievementsPage = () => {
  const { achievements, unlockedAchievements, loading, fetchAchievements } = useAchievements()

  useEffect(() => {
    fetchAchievements()
  }, [])

  if (loading) {
    return <Loading fullScreen message="Loading achievements..." />
  }

  const unlockedIds = new Set(unlockedAchievements.map((a) => a.id))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Achievements</h1>
        <p className={styles.subtitle}>
          {unlockedAchievements.length} of {achievements.length} unlocked
        </p>
      </div>

      <div className={styles.grid}>
        {achievements.map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} unlocked={unlockedIds.has(achievement.id)} />
        ))}
      </div>
    </div>
  )
}
