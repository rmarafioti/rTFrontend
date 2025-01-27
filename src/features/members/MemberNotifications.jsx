import { useState } from "react";
import { useGetMemberQuery } from "./membersSlice";
import Pagination from "../../components/Pagination";

import styles from "../../styling/dashboards.module.css";

export default function MemberNotifications() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 3;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Get the last 6 unique payments, only considering the first drop per payment
  const paidDrops = member.drop
    ?.filter((drop) => drop.paidDrop) // Filter drops with a valid paidDrop
    .reduce((uniquePayments, drop) => {
      // Only keep the first instance of each payment (by paidDrop.id)
      if (!uniquePayments.some((pd) => pd.paidDrop.id === drop.paidDrop.id)) {
        uniquePayments.push(drop);
      }
      return uniquePayments;
    }, [])
    .slice(-6)
    .reverse()
    .map((drop) => drop.paidDrop);

  // Calculate pagination
  const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentNotifications = paidDrops.slice(firstIndex, lastIndex);

  return (
    <article className="pageSetup">
      <section className={styles.dashboardSectionNotifications}>
        <h2 className={styles.subHeadersNotice}>Recent Payments:</h2>
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

              <p>
                Method of payment:{" "}
                {paidDrop.paidMessage || "*No payment message provided*"}
              </p>
              {/* Map over the drops associated with the payment */}
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
        <p className={styles.paymentName}>owner payment:</p>
        <p className={styles.payeeColor} id={styles.yellow}></p>
        <p>your payment:</p>
        <p className={styles.payeeColor} id={styles.blue}></p>
      </section>
      {paidDrops.length < 3 ? (
        " "
      ) : (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={paidDrops.length}
          itemsPerPage={notificationsPerPage}
        />
      )}
    </article>
  );
}
