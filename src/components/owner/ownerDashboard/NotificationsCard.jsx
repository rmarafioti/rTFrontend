import {
  useGetOwnerQuery,
  useOwnerPayDropsMutation,
} from "../../../features/owner/ownerSlice";

import styles from "../../../styling/dashboards.module.css";

export default function NotificationsCard() {
  const [confirmPayment] = useOwnerPayDropsMutation();
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract payment notices using reduce
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

      console.log("Attempting to confirm payment for drop IDs:", dropIds);

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

      console.log("Payment confirmed for notice ID:", notice.id);
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  return (
    <section className={styles.dashboardSection}>
      <h2 className={styles.subHeaders}>Payment Notifications:</h2>

      {payNotices?.length ? (
        payNotices.map((notice) => (
          <div key={notice.id} className={styles.currentDrop}>
            <div>
              <p>{new Date(notice.paidDate).toLocaleDateString("en-US")}:</p>
              <h4>{notice.payee}</h4>
              <p>
                {notice.paidMessage || "No message provided"} ${notice.amount}
              </p>
            </div>
            <h5>Paid for Drops on:</h5>
            <ul>
              {notice.drops.map((drop) => (
                <li key={drop.id}>
                  {new Date(drop.date).toLocaleDateString("en-US")}
                </li>
              ))}
            </ul>
            {/* Check if the drop has been paid */}
            {notice.drops.every((drop) => drop.paidDrop) ? (
              <p>Payment Confirmed</p>
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
