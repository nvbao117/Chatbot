import styles from "./Input.module.css"

export const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error = "",
  label = "",
  disabled = false,
  className = "",
  icon = null,
  ...props
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.error : ""} ${icon ? styles.inputWithIcon : ""} ${className}`}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
