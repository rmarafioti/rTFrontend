import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetOwnerQuery, usePayMemberDropsMutation } from "./ownerSlice";
import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();
  const [payMemberDrops] = usePayMemberDropsMutation();

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
  const handlePayout = async (memberId) => {
    const message = paidMessages[memberId] || "";
    try {
      await payMemberDrops({ memberId, paidMessage: message }).unwrap();
      console.log(`Paid out drops for member with ID: ${memberId}`);

      // Clear the message for the current member after successful payment
      setPaidMessages((prev) => ({
        ...prev,
        [memberId]: "",
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
                        <p>Owed: ${member.totalOwe}</p>
                        {!allPaid && <p>Pay: ${unpaidTotal}</p>}

                        {/* Only show payment options and button if there are unpaid drops */}
                        {!allPaid && (
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
                            <button onClick={() => handlePayout(member.id)}>
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

  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
      <p>Username: {owner?.username}</p>
      <p>Owner Name: {owner?.ownerName}</p>
      <p>Take Home Total: ${owner?.takeHomeTotal}</p>
      <BusinessMembersCard />
      <Link to={`/memberarchive`}>*Member Archive*</Link>
      <Link to={`/ownerhandledrops`}>*Handle Drops*</Link>
      <h3>Year Take Home Total:</h3>
      <h3>Monthly Totals: *list totals*</h3>
    </article>
  );
}
