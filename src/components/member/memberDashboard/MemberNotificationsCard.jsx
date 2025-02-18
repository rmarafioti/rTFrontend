import { Link } from "react-router-dom";
import { useGetMemberQuery } from "../../../features/members/membersSlice";

import styles from "../../../styling/member/membernotificationscard.module.css";

export default function MemberNotificationsCard() {
  const { data: member, error, isLoading } = useGetMemberQuery();

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

  return (
    <section className={styles.dashboardSectionNotifications}>
      <h2 className={styles.subHeadersNotice}>Recent Payments:</h2>
      {paidDrops?.length ? (
        paidDrops
          .reverse()
          .slice(0, 3)
          .map((paidDrop) => (
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
              {/* Map over the drops associated with this paidDrop */}
              <div className={styles.paidDates}>
                <p className={styles.paidMessage}>
                  {" "}
                  {paidDrop.paidMessage || "*No method provided*"} for Drops on:
                </p>
                <ul className={styles.paidDates}>
                  {member.drop
                    ?.filter((drop) => drop.paidDrop?.id === paidDrop.id)
                    .map((drop) => (
                      <li className={styles.paidDate} key={drop.id}>
                        *
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
        <p>*No payment notifications yet*</p>
      )}
      {paidDrops?.length ? (
        <div className={styles.paymentKey}>
          <p>owner payment:</p>
          <p className={styles.payeeColor} id={styles.yellow}></p>
          <p>your payment:</p>
          <p className={styles.payeeColor} id={styles.blue}></p>
        </div>
      ) : (
        ""
      )}
      <Link to="/membernotifications/" className={styles.link}>
        View all payments
      </Link>
    </section>
  );
}
