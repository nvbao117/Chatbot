/**
 * Trang Đăng Ký
 * 
 * Component này render trang đăng ký với thiết kế siêu hiện đại bao gồm:
 * - Background gradient động với các hình dạng trôi nổi
 * - Hiệu ứng theo dõi chuột
 * - Carousel giới thiệu các tính năng của ứng dụng
 * - Phần lợi ích với các ưu điểm chính
 * - Form đăng ký với tùy chọn đăng ký xã hội
 * 
 * Trang được thiết kế để vừa trong một màn hình không cần cuộn
 * và cung cấp trải nghiệm người dùng hấp dẫn về mặt thị giác.
 */

import { useState, useEffect } from "react"
import { RegisterForm } from "../../components/auth"
import styles from "./Register.module.css"

export const Register = () => {
  // State quản lý vị trí slide của carousel
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // State theo dõi vị trí chuột cho hiệu ứng follower
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Dữ liệu các tính năng cho carousel - mỗi tính năng có icon, tiêu đề, mô tả và gradient
  const features = [
    {
      icon: "🌟",
      title: "Personalized Learning",
      description: "Get customized study plans tailored to your unique learning style",
      gradient: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      icon: "📈",
      title: "Smart Analytics",
      description: "Track your progress with AI-powered insights and recommendations",
      gradient: "linear-gradient(135deg, #f093fb, #f5576c)"
    },
    {
      icon: "🤖",
      title: "AI Tutor",
      description: "Get 24/7 help from our advanced AI learning assistant",
      gradient: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    {
      icon: "🎮",
      title: "Gamified Experience",
      description: "Earn achievements and compete with friends in learning challenges",
      gradient: "linear-gradient(135deg, #43e97b, #38f9d7)"
    }
  ]

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <div className={styles.container}>
      {/* Animated Background */}
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
              <p className={styles.tagline}>Start Your Learning Revolution</p>
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

            <div className={styles.benefits}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>✨</div>
                <div className={styles.benefitText}>
                  <div className={styles.benefitTitle}>Free Forever</div>
                  <div className={styles.benefitDesc}>No hidden costs</div>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>🔒</div>
                <div className={styles.benefitText}>
                  <div className={styles.benefitTitle}>Secure & Private</div>
                  <div className={styles.benefitDesc}>Your data is safe</div>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIcon}>⚡</div>
                <div className={styles.benefitText}>
                  <div className={styles.benefitTitle}>Instant Access</div>
                  <div className={styles.benefitDesc}>Start learning now</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.title}>Join the Future!</h2>
              <p className={styles.subtitle}>Create your account and start learning</p>
            </div>
            
            <RegisterForm />
            
            <div className={styles.socialLogin}>
              <div className={styles.divider}>
                <span>or sign up with</span>
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
