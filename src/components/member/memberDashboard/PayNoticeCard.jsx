import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetMemberQuery,
  useMemberPayNoticeMutation,
  useMemberDeleteDropMutation,
} from "../../../features/members/membersSlice";

import styles from "../../../styling/dashboards.module.css";

export default function PayNoticeCard() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [payNotice] = useMemberPayNoticeMutation();
  const [deleteDrop] = useMemberDeleteDropMutation();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Calculate business total from unpaid drops
  const businessTotal = member.drop
    .filter((drop) => !drop.paid)
    .reduce((total, drop) => total + drop.businessOwes, 0);

  // Calculate member total for unpaid drops
  const memberTotal = member.drop
    .filter((drop) => !drop.paid)
    .reduce((total, drop) => total + drop.memberOwes, 0);

  const businessOwesTotal =
    /*memberTotal > 0 ? 0 :*/ businessTotal - memberTotal;

  // We don't want to see a members owes total if the business owes total is greater than 0
  const memberOwesTotal = businessOwesTotal > 0 ? 0 : memberTotal;

  const [paidMessages, setPaidMessages] = useState({});

  const paymentOptions = [
    "Paid via Cash",
    "Paid via Zelle",
    "Paid via Venmo",
    "Paid via PayPal",
    "Other",
  ];

  const handleMessageChange = (memberId, message) => {
    setPaidMessages((prev) => ({
      ...prev,
      [memberId]: message,
    }));
  };

  const unpaidDrops = member.drop?.filter((drop) => !drop.paid);

  // Check if there is a `paidNotice` for these unpaid drops
  const hasPendingNotice = unpaidDrops.some((drop) => drop.paidNotice);

  // Collect the IDs of unpaid drops
  const unpaidDropIds = unpaidDrops?.map((drop) => drop.id) || [];

  const sendPaymentNotice = async (memberId) => {
    const message = paidMessages[memberId] || "";
    if (unpaidDropIds.length === 0) {
      console.error("No drops to pay");
      return;
    }
    try {
      await payNotice({
        payee: member.memberName,
        paidMessage: message,
        amount: memberOwesTotal,
        dropIds: unpaidDropIds,
      }).unwrap();
      handleMessageChange(memberId, "");
    } catch (error) {
      console.error("Error sending payment notice:", error);
    }
  };

  const submitDeleteDrop = async (dropId) => {
    console.log("Deleting drop with ID:", dropId);
    try {
      await deleteDrop(dropId).unwrap();
    } catch (error) {
      console.error("Error deleting drop with ID ${dropId}:", error);
    }
  };

  return (
    <section className={styles.dashboardSection}>
      <h2 className={styles.subHeaders}>Current Drops:</h2>
      <div className={styles.memberDrops}>
        {unpaidDrops?.length ? (
          unpaidDrops.map((drop) => (
            <div key={drop.id} className={styles.currentDrop}>
              <Link className={styles.memberDrop} to={`/drop/${drop.id}`}>
                {new Date(drop.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
              </Link>
              <button
                onClick={() => submitDeleteDrop(drop.id)}
                className={styles.deleteDrop}
              >
                X
              </button>
            </div>
          ))
        ) : (
          <p>*All your drops are paid up to date*</p>
        )}
        {businessTotal !== 0 && (
          <p className={styles.totals}>Owed to You: {businessOwesTotal}</p>
        )}
        {memberOwesTotal !== 0 && (
          <p className={styles.totals}>You Owe: {memberOwesTotal}</p>
        )}

        {/* Render payment notification section if the member owes the business */}
        {memberOwesTotal > 0 && (
          <div className={styles.paymentNotice}>
            {hasPendingNotice ? (
              <p>Notice sent! Confirmation of payment pending.</p>
            ) : (
              <>
                <select
                  value={paidMessages[member.id] || ""}
                  onChange={(e) =>
                    handleMessageChange(member.id, e.target.value)
                  }
                  className={styles.paymentMethod}
                >
                  <option value="">Select Payment Method</option>
                  {paymentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => sendPaymentNotice(member.id)}
                  disabled={isLoading || !paidMessages[member.id]?.trim()}
                  className={styles.paymentNoticeButton}
                >
                  {isLoading ? "Sending..." : "Send Payment Notice"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
