"use client"

import styles from "./QuestionItem.module.css"

export const QuestionItem = ({ question, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className={styles.container}>
      <div className={styles.questionHeader}>
        <h3 className={styles.question}>{question.text}</h3>
        {question.type === "multiple-choice" && <span className={styles.type}>Multiple Choice</span>}
      </div>

      <div className={styles.options}>
        {question.options.map((option, index) => (
          <label key={index} className={styles.option}>
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onAnswerSelect(question.id, option.id)}
              className={styles.input}
            />
            <span className={styles.label}>{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
