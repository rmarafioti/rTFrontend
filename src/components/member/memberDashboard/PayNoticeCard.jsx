import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetMemberQuery,
  useMemberPayNoticeMutation,
} from "../../../features/members/membersSlice";

import styles from "../../../styling/memberDashboard.module.css";

export default function PayNoticeCard() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [payNotice] = useMemberPayNoticeMutation();

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

  // Business owes total is the business totol for the unpaid drops - member toatl which is there daily take home in cash

  const businessOwesTotal = memberTotal > 0 ? 0 : businessTotal - memberTotal;

  // if business owes total is greater than 0 than member owes total should be 0 else it is the accumulation of member total
  const memberOwesTotal = businessOwesTotal > 0 ? 0 : memberTotal;

  // State to manage payment messages for each member
  const [paidMessages, setPaidMessages] = useState({});

  const paymentOptions = [
    "Paid via Cash",
    "Paid via Zelle",
    "Paid via Venmo",
    "Paid via PayPal",
    "Other",
  ];

  // Handle message change for a specific member
  const handleMessageChange = (memberId, message) => {
    setPaidMessages((prev) => ({
      ...prev,
      [memberId]: message,
    }));
  };

  const unpaidDrops = member.drop?.filter((drop) => !drop.paid);

  // Check if there's already a `paidNotice` for these unpaid drops
  const hasPendingNotice = unpaidDrops.some((drop) => drop.paidNotice);

  // Collect the IDs of unpaid drops
  const unpaidDropIds = unpaidDrops?.map((drop) => drop.id) || [];

  // send a paymnet notice
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

  return (
    <section>
      <h3>Current Drops:</h3>
      <div className={styles.memberDrops}>
        {unpaidDrops?.length ? (
          unpaidDrops.map((drop) => (
            <Link
              className={styles.memberDrop}
              to={`/memberdrop/${drop.id}`}
              key={drop.id}
            >
              {new Date(drop.date).toLocaleDateString("en-US", {
                timeZone: "UTC",
              })}
            </Link>
          ))
        ) : (
          <p>All your drops are paid up to date</p>
        )}
      </div>
      <p>Owed to You: {businessOwesTotal}</p>
      <p>You Owe: {memberOwesTotal}</p>

      {/* Render payment notification section if the member owes the business */}
      {memberOwesTotal > 0 && (
        <div>
          {hasPendingNotice ? (
            <p>Notice sent! Confirmation of payment pending.</p>
          ) : (
            <>
              <h4>Send Payment Notice</h4>
              <label>Payment Method:</label>
              <select
                value={paidMessages[member.id] || ""}
                onChange={(e) => handleMessageChange(member.id, e.target.value)}
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
              >
                {isLoading ? "Sending..." : "Send Payment Notice"}
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
