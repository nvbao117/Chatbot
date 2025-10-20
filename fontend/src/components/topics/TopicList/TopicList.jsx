"use client"

import { useEffect } from "react"
import { useTopics } from "../../../hooks"
import { TopicCard } from "../TopicCard"
import { Loading } from "@/components/common"
import styles from "./TopicList.module.css"

export const TopicList = ({ subjectId, onSelectTopic }) => {
  const { topics, loading, fetchTopics } = useTopics()

  useEffect(() => {
    if (subjectId) {
      fetchTopics({ subjectId })
    } else {
      fetchTopics()
    }
  }, [subjectId])

  if (loading) {
    return <Loading message="Loading topics..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onClick={onSelectTopic} />
        ))}
      </div>
    </div>
  )
}
