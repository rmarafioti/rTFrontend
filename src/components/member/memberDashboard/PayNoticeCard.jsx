import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetMemberQuery,
  useMemberPayNoticeMutation,
  useMemberDeleteDropMutation,
} from "../../../features/members/membersSlice";

import styles from "../../../styling/member/paynoticecard.module.css";

export default function PayNoticeCard() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [payNotice] = useMemberPayNoticeMutation();
  const [selectedDropId, setSelectedDropId] = useState(null);
  const [deleteDrop] = useMemberDeleteDropMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const submitDeleteDrop = async (dropId) => {
    console.log("Deleting drop with ID:", dropId);
    try {
      await deleteDrop(dropId).unwrap();
      closeModal();
    } catch (error) {
      console.error("Error deleting drop with ID ${dropId}:", error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedDropId(null);
  };

  function DeleteModal({ dropId }) {
    return (
      <>
        {isModalVisible && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <p className={styles.message}>
                Are you sure you want to delete this drop?
              </p>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.modalButton}
                  id={styles.no}
                  onClick={closeModal}
                >
                  No
                </button>
                <button
                  className={styles.modalButton}
                  id={styles.yes}
                  onClick={() => submitDeleteDrop(dropId)}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // We don't want to see a members owes total if the business owes total is greater than 0
  const memberOwesTotal =
    member.totalOwed > 0 ? 0 : Math.max(0, member.totalOwe);

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

  // Collect the ids of unpaid drops
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
                onClick={() => {
                  setSelectedDropId(drop.id);
                  setIsModalVisible(true);
                }}
                className={styles.deleteDrop}
              >
                X
              </button>
            </div>
          ))
        ) : (
          <p>*All your drops are paid up to date*</p>
        )}
        {member.totalOwed > 0 ? (
          <p className={styles.totals}>Owed to You: {member.totalOwed}</p>
        ) : memberOwesTotal > 0 ? (
          <p className={styles.totals}>You Owe: {memberOwesTotal}</p>
        ) : null}

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
      <DeleteModal dropId={selectedDropId} />
    </section>
  );
}
