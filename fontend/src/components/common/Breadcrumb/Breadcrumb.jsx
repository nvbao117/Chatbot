import { Link } from "react-router-dom"
import styles from "./Breadcrumb.module.css"

export const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <nav className={`${styles.breadcrumb} ${className}`} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            {item.href ? (
              <>
                <Link to={item.href} className={styles.link}>
                  {item.label}
                </Link>
                {index < items.length - 1 && <span className={styles.separator}>/</span>}
              </>
            ) : (
              <>
                <span className={styles.current}>{item.label}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
