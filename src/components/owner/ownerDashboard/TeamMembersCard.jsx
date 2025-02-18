import { useState } from "react";
import {
  useGetOwnerQuery,
  useOwnerPayDropsMutation,
} from "../../../features/owner/ownerSlice";
import { Link } from "react-router-dom";

import styles from "../../../styling/owner/teammemberscard.module.css";

export default function TeamMembersCard() {
  const [confirmPayment] = useOwnerPayDropsMutation();
  const { data: owner, error, isLoading } = useGetOwnerQuery();
  const [paidMessages, setPaidMessages] = useState({});

  const paymentOptions = [
    "Paid via Cash",
    "Paid via Zelle",
    "Paid via Venmo",
    "Paid via PayPal",
    "Other",
  ];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleMessageChange = (memberId, message) => {
    setPaidMessages((prev) => ({
      ...prev,
      [memberId]: message,
    }));
  };

  // Handle payout for a specific member
  const handlePayout = async (member) => {
    const message = paidMessages[member.id] || "";
    const unpaidDrops = member.drop?.filter((drop) => !drop.paid);
    const dropIds = unpaidDrops.map((drop) => drop.id);
    // Sum of `businessOwes` for unpaid drops
    const businessOwesSum = unpaidDrops.reduce(
      (total, drop) => total + drop.businessOwes,
      0
    );

    // Sum of `memberOwes` for unpaid drops
    const memberOwesSum = unpaidDrops.reduce(
      (total, drop) => total + drop.memberOwes,
      0
    );

    // Calculate the final amount (memberCut minus total businessOwes)
    const amount = businessOwesSum - memberOwesSum;
    try {
      await confirmPayment({
        payee: owner.ownerName,
        paidMessage: message,
        amount,
        dropIds,
        memberId: member.id,
      }).unwrap();

      // Clear the message for the current member after successful payment
      setPaidMessages((prev) => ({
        ...prev,
        [member.id]: "",
      }));
    } catch (error) {
      console.error("Error paying out drop:", error);
    }
  };

  return (
    <section className={styles.dashboardSection}>
      <h2 className={styles.subHeaders}>Unpaid Services:</h2>
      {owner?.ownerBusiness?.length ? (
        // Check if any unpaid drops exist across all business members
        owner.ownerBusiness.some((business) =>
          business.businessMember?.some((member) =>
            member.drop?.some((drop) => !drop.paid)
          )
        ) ? (
          owner.ownerBusiness.map((business) => (
            <div className={styles.memberDrops} key={business.id}>
              {business.businessMember?.map((member) => {
                const unpaidDrops = member.drop?.filter((drop) => !drop.paid);

                // Only render members with unpaid drops
                if (!unpaidDrops || unpaidDrops.length === 0) {
                  return null;
                }
                // Calculate the total amount of unpaid drops for memberOwes
                const unpaidTotalMemberOwes = unpaidDrops.reduce(
                  (total, drop) => total + drop.memberOwes,
                  0
                );

                // Subtract the total of businessOwes from the result
                const totalBusinessOwes = unpaidDrops.reduce(
                  (total, drop) => total + drop.businessOwes,
                  0
                );

                const unpaidTotal = totalBusinessOwes - unpaidTotalMemberOwes;

                const payAmount = unpaidTotal;

                return (
                  <li className={styles.unpaidSection} key={member.id}>
                    <p className={styles.teamMemberName}>
                      {member.memberName} :
                    </p>
                    <div className={styles.memberCurrentDrop}>
                      {unpaidDrops.map((drop) => (
                        <Link
                          to={`/drop/${drop.id}`}
                          key={drop.id}
                          className={styles.memberDrop}
                        >
                          {new Date(drop.date).toLocaleDateString("en-US", {
                            timeZone: "UTC",
                          })}
                        </Link>
                      ))}
                    </div>
                    {member.totalOwe < payAmount ? (
                      ""
                    ) : (
                      <p className={styles.totals} id={styles.teamMemberOwes}>
                        Team Member Owes: ${member.totalOwe}
                      </p>
                    )}
                    {payAmount !== 0 ||
                      (payAmount < 0 && (
                        <p className={styles.totals}>
                          Total Balance to Pay: ${payAmount}
                        </p>
                      ))}
                    {/* Only show payment options and button if the 'Pay' is greater than 0 or not all paid*/}
                    {payAmount > 0 && (
                      <div className={styles.paymentNotice}>
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
                          onClick={() => handlePayout(member)}
                          className={styles.paymentNoticeButton}
                        >
                          Payout Team Member
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </div>
          ))
        ) : (
          <p className={styles.noServicesMessage}>
            *No unpaid services at this time*
          </p>
        )
      ) : (
        <p>No businesses found.</p>
      )}
    </section>
  );
}
