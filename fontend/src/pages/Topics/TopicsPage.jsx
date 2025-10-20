"use client"

import { useParams } from "react-router-dom"
import { TopicList } from "../../components/topics"
import styles from "./TopicsPage.module.css"

export const TopicsPage = () => {
  const { subjectId } = useParams()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Topics</h1>
        <p className={styles.subtitle}>Select a topic to learn</p>
      </div>
      <TopicList subjectId={subjectId} />
    </div>
  )
}
