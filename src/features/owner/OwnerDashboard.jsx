import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetOwnerQuery, useOwnerPayDropsMutation } from "./ownerSlice";
import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  const [confirmPayment] = useOwnerPayDropsMutation();
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  // State to manage payment messages for each member
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

  // Handle message change for a specific member
  const handleMessageChange = (memberId, message) => {
    setPaidMessages((prev) => ({
      ...prev,
      [memberId]: message,
    }));
  };

  // Handle payout for a specific member
  const handlePayout = async (member) => {
    const message = paidMessages[member.id] || ""; // Get the payment message for the member
    const unpaidDrops = member.drop?.filter((drop) => !drop.paid); // Get unpaid drops for the member
    const dropIds = unpaidDrops.map((drop) => drop.id); // Extract drop IDs from unpaid drops
    const amount = unpaidDrops.reduce(
      (total, drop) => total + drop.memberCut,
      0
    ); // Calculate the total amount

    try {
      await confirmPayment({
        payee: owner.ownerName, // Member's name as the payee
        paidMessage: message, // Message entered by the owner
        amount, // Total amount to pay
        dropIds, // List of unpaid drop IDs
      }).unwrap();

      console.log(`Paid out drops for member with ID: ${member.id}`);

      // Clear the message for the current member after successful payment
      setPaidMessages((prev) => ({
        ...prev,
        [member.id]: "",
      }));
    } catch (error) {
      console.error("Error paying out drop:", error);
    }
  };

  function BusinessMembersCard() {
    return (
      <section>
        <h2>Your Team Members</h2>
        {owner?.ownerBusiness?.length ? (
          owner.ownerBusiness.map((business) => (
            <div key={business.id}>
              <h3>{business.businessName}</h3>
              <ul>
                {business.businessMember?.length ? (
                  business.businessMember.map((member) => {
                    const unpaidDrops = member.drop?.filter(
                      (drop) => !drop.paid
                    );
                    const allPaid = unpaidDrops.length === 0;

                    // Calculate the total amount of unpaid drops
                    const unpaidTotal = unpaidDrops.reduce(
                      (total, drop) => total + drop.memberCut,
                      0
                    );

                    const payAmount = member.totalOwe > 0 ? 0 : unpaidTotal;

                    return (
                      <li key={member.id}>
                        <p>{member.memberName}</p>
                        <div>
                          {unpaidDrops.length > 0 ? (
                            unpaidDrops.map((drop) => (
                              <Link to={`/memberdrop/${drop.id}`} key={drop.id}>
                                {new Date(drop.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    timeZone: "UTC",
                                  }
                                )}
                              </Link>
                            ))
                          ) : (
                            <p>No unpaid drops</p>
                          )}
                        </div>
                        {!allPaid && (
                          <>
                            <p>Owed: ${member.totalOwe}</p>
                            <p>Pay: ${payAmount}</p>
                          </>
                        )}

                        {/* Only show payment options and button if the 'Pay' is greater than 0 */}
                        {payAmount > 0 && (
                          <>
                            <label>Payment Method:</label>
                            <select
                              value={paidMessages[member.id] || ""}
                              onChange={(e) =>
                                handleMessageChange(member.id, e.target.value)
                              }
                            >
                              <option value="">Select Payment Method</option>
                              {paymentOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <button onClick={() => handlePayout(member)}>
                              Payout Team Member
                            </button>
                          </>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <p>No team members for this business.</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No businesses found.</p>
        )}
      </section>
    );
  }

  function OwnerNotificationCard() {
    /*const [confirmPayment, { isLoading }] = useOwnerPayDropsMutation();*/

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

        await confirmPayment({
          payee: notice.payee,
          paidMessage: notice.paidMessage,
          amount: notice.amount,
          dropIds,
        }).unwrap();

        console.log("Payment confirmed for notice ID:", notice.id);
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    };

    return (
      <section>
        <h2>Payment Notices</h2>
        {payNotices?.length ? (
          payNotices.map((notice) => (
            <div key={notice.id}>
              <h4>Notice from: {notice.payee}</h4>
              <p>
                Amount: ${notice.amount} on{" "}
                {new Date(notice.paidDate).toLocaleDateString("en-US")}
              </p>
              <p>Message: {notice.paidMessage || "No message provided"}</p>
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
                <p className="confirmed">Payment Confirmed</p>
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
          <p>No payment notices found</p>
        )}
      </section>
    );
  }

  function MemberArchivesCard() {
    return (
      <section>
        <h2>Team Member Archives</h2>
        {owner?.ownerBusiness?.length ? (
          <ul>
            {owner.ownerBusiness.map((business) =>
              business.businessMember?.map((member) => (
                <li key={member.id}>
                  <Link to={`/ownermembersarchive/${member.id}`}>
                    {member.memberName}
                  </Link>
                </li>
              ))
            )}
          </ul>
        ) : (
          <p>No Members Found</p>
        )}
      </section>
    );
  }

  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
      <p>Username: {owner?.username}</p>
      <p>Owner Name: {owner?.ownerName}</p>
      <p>Take Home Total: ${owner?.takeHomeTotal}</p>
      <BusinessMembersCard />
      <OwnerNotificationCard />
      <MemberArchivesCard />
    </article>
  );
}
