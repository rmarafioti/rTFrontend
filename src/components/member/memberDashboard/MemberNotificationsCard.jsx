import { useGetMemberQuery } from "../../../features/members/membersSlice";

import styles from "../../../styling/dashboards.module.css";

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
      <h2 className={styles.subHeadersNotice}>Payment Notifications:</h2>
      {paidDrops?.length ? (
        paidDrops
          .reverse()
          .slice(0, 3)
          .map((paidDrop) => (
            <div key={paidDrop.id} className={styles.noticeSection}>
              <p>
                {new Date(paidDrop.paidDate).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}{" "}
                - Payment of ${paidDrop.amount} from {paidDrop.payee}
              </p>
              {/*<p>From {paidDrop.payee}</p>*/}
              <p>{paidDrop.paidMessage || "*No payment message provided*"}</p>

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
    </section>
  );
}
