import styles from "./TypingIndicator.module.css"

export const TypingIndicator = () => {
  return (
    <div className={styles.typingIndicator}>
      <div className={styles.typingDot}></div>
      <div className={styles.typingDot}></div>
      <div className={styles.typingDot}></div>
    </div>
  )
}

export default TypingIndicator
