import React from "react";
import styles from "../styling/member/archive.module.css";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={styles.pageControls}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={styles.pageControls}
      >
        Next
      </button>
    </div>
  );
}
