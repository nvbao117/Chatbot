import { Spinner } from "./Spinner"
import styles from "./Loading.module.css"

export const Loading = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className={styles.loadingContainer}>
      <Spinner size="lg" />
      <p className={styles.message}>{message}</p>
    </div>
  )

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>
  }

  return content
}
