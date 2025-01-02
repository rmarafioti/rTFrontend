import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMemberGetDropsQuery } from "./membersSlice";
import styles from "../../styling/droparchives.module.css";

export default function MemberArchiveMonth() {
  const { year, month } = useParams();

  const { data: member, error, isLoading } = useMemberGetDropsQuery(year);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  const drops = member?.drops || [];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Filter drops for the specific month
  const filteredDrops = drops.filter((drop) => {
    const dropDate = new Date(drop.date);
    return (
      dropDate.getFullYear() === parseInt(year, 10) &&
      dropDate.getMonth() + 1 === parseInt(month, 10) // Match month and year
    );
  });

  //calculate pagination
  const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentNotifications = filteredDrops?.slice(firstIndex, lastIndex);

  // Generate the name of the month dynamically
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(parseInt(year, 10), parseInt(month, 10) - 1)
  );

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        Drops for {monthName} {year}:
      </h1>
      {currentNotifications?.length ? (
        <ul className={styles.drops}>
          {currentNotifications.map((drop) => (
            <Link className={styles.date} to={`/drop/${drop.id}`} key={drop.id}>
              <li className={styles.link}>
                {new Date(drop.date).toLocaleDateString("en-US")}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>*No drops found for this month*</p>
      )}
      {/* pagination controls */}
      {drops.length > notificationsPerPage && (
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
            {Math.ceil(drops.length / notificationsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(drops.length / notificationsPerPage)
                )
              )
            }
            disabled={
              currentPage == Math.ceil(drops.length / notificationsPerPage)
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
