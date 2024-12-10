import { useState } from "react";
import { Link } from "react-router-dom";
import { useMemberGetPaidDropsQuery } from "./membersSlice";

import styles from "../../styling/droparchives.module.css";

export default function MemberArchive() {
  const { data: paidDrops, error, isLoading } = useMemberGetPaidDropsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  //calculate pagination
  const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentNotifications = paidDrops?.slice(firstIndex, lastIndex);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Your Archived Drops</h1>
      {currentNotifications?.length ? (
        <ul className={styles.drops}>
          {currentNotifications.map((drop) => (
            <Link className={styles.date} to={`/memberdrop/${drop.id}`}>
              <li key={drop.id} className={styles.link}>
                {new Date(drop.date).toLocaleDateString("en-US")}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>*No archived drops found*</p>
      )}
      {/* pagination controls */}
      {paidDrops.length > notificationsPerPage && (
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageControls}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of{" "}
            {Math.ceil(paidDrops.length / notificationsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(paidDrops.length / notificationsPerPage)
                )
              )
            }
            disabled={
              currentPage == Math.ceil(paidDrops.length / notificationsPerPage)
            }
            className={styles.pageControls}
          >
            Next
          </button>
        </div>
      )}
    </article>
  );
}
