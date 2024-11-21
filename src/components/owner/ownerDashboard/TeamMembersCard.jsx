import { useState } from "react";
import {
  useGetOwnerQuery,
  useOwnerPayDropsMutation,
} from "../../../features/owner/ownerSlice";
import { Link } from "react-router-dom";

export default function TeamMembersCard() {
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
        memberId: member.id,
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

  return (
    <section>
      <h2>Your Team Members</h2>
      {owner?.ownerBusiness?.length ? (
        owner.ownerBusiness.map((business) => (
          <div key={business.id}>
            <ul>
              {business.businessMember?.length ? (
                business.businessMember.map((member) => {
                  const unpaidDrops = member.drop?.filter((drop) => !drop.paid);
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
                              {new Date(drop.date).toLocaleDateString("en-US", {
                                timeZone: "UTC",
                              })}
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

                      {/* Only show payment options and button if the 'Pay' is greater than 0 or not all paid*/}
                      {member.totalOwe > 0 ||
                        (!allPaid && (
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
                        ))}
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
