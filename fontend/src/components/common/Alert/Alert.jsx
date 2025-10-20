"use client"

import styles from "./Alert.module.css"

export const Alert = ({ type = "info", title, message, onClose, className = "" }) => {
  return (
    <div className={`${styles.alert} ${styles[`alert-${type}`]} ${className}`}>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  )
}
