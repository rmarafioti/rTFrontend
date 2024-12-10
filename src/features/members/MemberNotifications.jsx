import { useState } from "react";
import { useGetMemberQuery } from "./membersSlice";

import styles from "../../styling/dashboards.module.css";

export default function MemberNotifications() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract all unique paidDrops from the member's drops
  const paidDrops = member.drop
    ?.filter((drop) => drop.paidDrop)
    .map((drop) => drop.paidDrop)
    .filter(
      (value, index, self) =>
        self.findIndex((pd) => pd.id === value.id) === index
    );

  //calculate pagination
  const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentNotifications = paidDrops.slice(firstIndex, lastIndex);

  return (
    <article className="pageSetup">
      <section className={styles.dashboardSectionNotifications}>
        <h2 className={styles.subHeadersNotice}>Payments:</h2>
        {currentNotifications?.length ? (
          currentNotifications.map((paidDrop) => (
            <div key={paidDrop.id} className={styles.noticeSection}>
              <div className={styles.datePayment}>
                <p
                  className={`${styles.payeeColor} ${
                    paidDrop.payee === member.memberName
                      ? styles.blue
                      : styles.yellow
                  }`}
                ></p>
                <p>
                  {new Date(paidDrop.paidDate).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}{" "}
                  - Payment of ${paidDrop.amount} from {paidDrop.payee}
                </p>
              </div>
              {/*<p>From {paidDrop.payee}</p>*/}
              <p>
                Method of payment:{" "}
                {paidDrop.paidMessage || "*No payment message provided*"}
              </p>

              {/* Map over the drops associated with this paidDrop */}
              <div className={styles.paidDatesSection}>
                <h5>Paid for Drops on:</h5>
                <ul className={styles.paidDates}>
                  {member.drop
                    ?.filter((drop) => drop.paidDrop?.id === paidDrop.id)
                    .map((drop) => (
                      <li key={drop.id}>
                        {new Date(drop.date).toLocaleDateString("en-US", {
                          timeZone: "UTC",
                        })}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p>No payment notifications yet.</p>
        )}
        <div className={styles.paymentKey}>
          <p>your payment:</p>
          <p className={styles.payeeColor} id={styles.blue}></p>
          <p>owner payment:</p>
          <p className={styles.payeeColor} id={styles.yellow}></p>
        </div>
      </section>
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
