import styles from "./Footer.module.css"

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h4 className={styles.title}>EduLearn</h4>
          <p className={styles.description}>Master any subject with AI-powered learning</p>
        </div>

        <div className={styles.section}>
          <h5 className={styles.heading}>Quick Links</h5>
          <ul className={styles.links}>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="/subjects">Subjects</a>
            </li>
            <li>
              <a href="/progress">Progress</a>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h5 className={styles.heading}>Support</h5>
          <ul className={styles.links}>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© 2025 EduLearn. All rights reserved.</p>
      </div>
    </footer>
  )
}
