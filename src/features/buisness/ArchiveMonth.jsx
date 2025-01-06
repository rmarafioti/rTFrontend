import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { selectMemberToken } from "../auth/authMemberSlice";
import { useGetMemberDropsQuery } from "../owner/ownerSlice";

import styles from "../../styling/droparchives.module.css";

dayjs.extend(utc);

export default function ArchiveMonth() {
  const { memberId, year, month } = useParams(); // Get memberId, year, and month from URL
  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  // Use the query to fetch the specific member's drops for the given month and year
  const { data, isLoading, error } = useGetMemberDropsQuery({
    memberId,
    year,
    month,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const dropsPerPage = 5; // Number of drops per page

  // Error handling
  if (!role) {
    return <p>Error: Unable to determine user role. Please log in again.</p>;
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const drops = data?.drops || [];
  const memberName = data?.memberDetails?.memberName || "Unknown Member";

  // Pagination Logic
  const lastIndex = currentPage * dropsPerPage;
  const firstIndex = lastIndex - dropsPerPage;
  const currentDrops = drops.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(drops.length / dropsPerPage);

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        {role === "owner" ? `${memberName}'s Archives` : "Your Archived Drops"}
      </h1>

      {currentDrops.length > 0 ? (
        <ul className={styles.drops}>
          {currentDrops.map((drop) => (
            <Link className={styles.date} to={`/drop/${drop.id}`} key={drop.id}>
              <li className={styles.link}>
                {dayjs.utc(drop.date).format("MMM D, YYYY")}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No drops found for this month</p>
      )}

      {/* Pagination Controls */}
      {drops.length > dropsPerPage && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageControls}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={styles.pageControls}
          >
            Next
          </button>
        </div>
      )}
    </article>
  );
}
