"use client"

import styles from "./Pagination.module.css"
import { Button } from "../Button"

export const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  const pages = []
  const maxVisible = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className={`${styles.pagination} ${className}`}>
      <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </Button>

      <div className={styles.pages}>
        {startPage > 1 && (
          <>
            <Button variant={currentPage === 1 ? "primary" : "ghost"} size="sm" onClick={() => onPageChange(1)}>
              1
            </Button>
            {startPage > 2 && <span className={styles.dots}>...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.dots}>...</span>}
            <Button
              variant={currentPage === totalPages ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}
