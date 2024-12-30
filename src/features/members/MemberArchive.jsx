import { Link } from "react-router-dom";
import { useMemberGetDropsQuery } from "./membersSlice";

import styles from "../../styling/droparchives.module.css";

export default function MemberArchive() {
  const year = new Date().getFullYear(); // Default to the current year
  const { data, error, isLoading } = useMemberGetDropsQuery(year);

  const drops = data?.drops || [];

  // Group drops by month
  const dropsByMonth = drops.reduce((acc, drop) => {
    const date = new Date(drop.date);
    const month = date.getMonth() + 1; // 1-based month
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);

    if (!acc[month]) {
      acc[month] = {
        monthName,
        drops: [],
      };
    }

    acc[month].drops.push(drop);
    return acc;
  }, {});
  /*const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;*/

  //calculate pagination
  /*const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentNotifications = paidDrops?.slice(firstIndex, lastIndex);*/

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Your Archived Drops</h1>
      {Object.keys(dropsByMonth).length > 0 ? (
        <ul className={styles.months}>
          {Object.entries(dropsByMonth).map(([month, { monthName }]) => (
            <li key={month} className={styles.month}>
              <Link to={`/memberarchivemonth/${year}/${month}`}>
                {monthName} {year}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>*No drops found for this year*</p>
      )}
      {/* pagination controls */}
      {/*{paidDrops.length > notificationsPerPage && (
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
      )}*/}
    </article>
  );
}
