import styles from "./Loading.module.css"

export const Spinner = ({ size = "md", className = "" }) => {
  return <div className={`${styles.spinner} ${styles[`spinner-${size}`]} ${className}`}></div>
}
