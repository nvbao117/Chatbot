import { useEffect } from "react"
import { useSubjects } from "../../../hooks"
import { SubjectCard } from "../SubjectCard"
import { Loading } from "@/components/common"
import styles from "./SubjectList.module.css"

export const SubjectList = ({ onSelectSubject }) => {
  const { subjects, loading, fetchSubjects } = useSubjects()

  useEffect(() => {
    fetchSubjects()
  }, [])

  if (loading) {
    return <Loading message="Loading subjects..." />
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} onClick={onSelectSubject} />
        ))}
      </div>
    </div>
  )
}
