import {
  useGetOwnerQuery,
  useOwnerPayDropsMutation,
} from "../../../features/owner/ownerSlice";

import styles from "../../../styling/owner/notificationscard.module.css";

export default function NotificationsCard() {
  const [confirmPayment] = useOwnerPayDropsMutation();
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract payment notices
  const payNotices = owner?.ownerBusiness?.reduce((acc, business) => {
    business.businessMember.forEach((member) => {
      member.drop.forEach((drop) => {
        if (drop.paidNotice) {
          const existingNotice = acc.find(
            (notice) => notice.id === drop.paidNotice.id
          );
          if (!existingNotice) {
            acc.push({ ...drop.paidNotice, drops: [drop] });
          } else {
            existingNotice.drops.push(drop);
          }
        }
      });
    });
    return acc;
  }, []);

  const handleConfirmPayment = async (notice) => {
    try {
      const dropIds = notice.drops.map((drop) => drop.id);
      const memberId = notice.drops[0]?.member_id;

      if (!memberId) {
        console.error("Member ID not found in notice drops");
        return;
      }

      await confirmPayment({
        payee: notice.payee,
        paidMessage: notice.paidMessage,
        amount: notice.amount,
        dropIds,
        memberId,
      }).unwrap();
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  return (
    <section className={styles.dashboardSectionNotifications}>
      <h2 className={styles.subHeadersNotice}>Payment Notifications:</h2>
      {payNotices?.length ? (
        payNotices.map((notice) => (
          <div key={notice.id} className={styles.noticeSection}>
            <div>
              <p className={styles.payDate}>
                <b>*</b> {new Date(notice.paidDate).toLocaleDateString("en-US")}{" "}
                -Payment of ${notice.amount} from {notice.payee}
              </p>
              <p className={styles.paidMessage}>
                {notice.paidMessage || "No message provided"} for Drops On:
              </p>
            </div>
            <div className={styles.paidDatesSection}>
              <ul className={styles.paidDates}>
                {notice.drops.map((drop) => (
                  <li className={styles.paidDate} key={drop.id}>
                    <b>*</b> {new Date(drop.date).toLocaleDateString("en-US")}
                  </li>
                ))}
              </ul>
            </div>
            {/* Check if the drop has been paid */}
            {notice.drops.every((drop) => drop.paidDrop) ? (
              <p className={styles.paymentConfirm}>Payment Confirmed</p>
            ) : (
              <button
                onClick={() => handleConfirmPayment(notice)}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Payment"}
              </button>
            )}
          </div>
        ))
      ) : (
        <p className={styles.noPayNotice}>*No payment notices found*</p>
      )}
    </section>
  );
}
