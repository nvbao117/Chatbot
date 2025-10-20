import { useState } from "react"
import { SubjectList } from "../../components/subjects"
import { Card } from "@/components/common"
import styles from "./SubjectsPage.module.css"

export const SubjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Subjects", icon: "📚", color: "#667eea" },
    { id: "science", name: "Science", icon: "🔬", color: "#764ba2" },
    { id: "math", name: "Mathematics", icon: "🧮", color: "#f093fb" },
    { id: "language", name: "Languages", icon: "📝", color: "#4ecdc4" },
    { id: "history", name: "History", icon: "🌍", color: "#45b7d1" },
    { id: "arts", name: "Arts", icon: "🎨", color: "#96ceb4" }
  ]

  const stats = [
    { label: "Total Subjects", value: "24", icon: "📚" },
    { label: "Completed", value: "8", icon: "✅" },
    { label: "In Progress", value: "5", icon: "🔄" },
    { label: "Available", value: "11", icon: "🆕" }
  ]

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>📚 Learning Subjects</h1>
          <p className={styles.subtitle}>Explore our comprehensive collection of subjects and start your learning journey</p>
        </div>
        
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Category Filter */}
      <div className={styles.categorySection}>
        <h2 className={styles.sectionTitle}>Browse by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              style={{ '--category-color': category.color }}
            >
              <div className={styles.categoryIcon}>{category.icon}</div>
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subjects List */}
      <div className={styles.subjectsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {selectedCategory === "all" ? "All Subjects" : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className={styles.filterInfo}>
            {searchTerm && (
              <span className={styles.searchResult}>
                Results for "{searchTerm}"
              </span>
            )}
          </div>
        </div>
        <SubjectList searchTerm={searchTerm} category={selectedCategory} />
      </div>
    </div>
  )
}
