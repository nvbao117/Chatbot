import styles from "./Button.module.css"

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const variantClass = styles[`btn-${variant}`]
  const sizeClass = styles[`btn-${size}`]

  return (
    <button
      className={`${styles.btn} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner}>
          <span className={styles.dot}></span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
