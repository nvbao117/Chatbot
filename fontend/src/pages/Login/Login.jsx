import { useState, useEffect } from "react"
import { LoginForm } from "../../components/auth"
import styles from "./Login.module.css"

export const Login = () => {
  // State quản lý vị trí slide của carousel
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // State theo dõi vị trí chuột cho hiệu ứng follower
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Dữ liệu các tính năng cho carousel - mỗi tính năng có icon, tiêu đề, mô tả và gradient
  const features = [
    {
      icon: "🚀",
      title: "AI-Powered Learning",
      description: "Experience the future of education with our advanced AI tutor",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      icon: "📚",
      title: "Interactive Content",
      description: "Engage with dynamic, multimedia learning materials",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)"
    },
    {
      icon: "📊",
      title: "Smart Analytics",
      description: "Track your progress with intelligent insights and recommendations",
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    {
      icon: "🏆",
      title: "Gamified Learning",
      description: "Earn achievements and compete with friends in learning challenges",
      gradient: "linear-gradient(135deg, #43e97b, #38f9d7)"
    }
  ]

  // Effect theo dõi chuyển động chuột cho hiệu ứng follower
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Effect tự động chuyển slide carousel mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className={styles.container}>
      {/* Background động với các hình dạng trôi nổi và hiệu ứng theo chuột */}
      <div className={styles.background}>
        <div className={styles.floatingShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
          <div className={styles.shape5}></div>
        </div>
        <div 
          className={styles.mouseFollower}
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
          }}
        ></div>
      </div>

      <div className={styles.content}>
        {/* Left Side - Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.branding}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                  <div className={styles.logoInner}>🎓</div>
                </div>
                <h1 className={styles.logo}>EduLearn</h1>
              </div>
              <p className={styles.tagline}>Where Learning Meets Innovation</p>
            </div>

            <div className={styles.featuresCarousel}>
              <div 
                className={styles.carouselTrack}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              > 
                {features.map((feature, index) => (
                  <div key={index} className={styles.featureSlide}>
                    <div 
                      className={styles.featureCard}
                      style={{ background: feature.gradient }}
                    >
                      <div className={styles.featureIcon}>{feature.icon}</div>
                      <h3 className={styles.featureTitle}>{feature.title}</h3>
                      <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.carouselDots}>
                {features.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Students</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>95%</div>
                <div className={styles.statLabel}>Success Rate</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>AI Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.title}>Welcome Back!</h2>
              <p className={styles.subtitle}>Sign in to continue your journey</p>
            </div>
            
            <LoginForm />
            
            <div className={styles.socialLogin}>
              <div className={styles.divider}>
                <span>or continue with</span>
              </div>
              <div className={styles.socialButtons}>
                <button className={styles.socialButton}>
                  <span className={styles.socialIcon}>🔍</span>
                  Google
                </button>
                <button className={styles.socialButton}>
                  <span className={styles.socialIcon}>📘</span>
                  Facebook
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
