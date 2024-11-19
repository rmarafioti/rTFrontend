import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMemberQuery,
  useMemberCreateDropMutation,
  useMemberPayNoticeMutation,
} from "./membersSlice";
import { Link } from "react-router-dom";

import styles from "../../styling/MemberDashboard.module.css";
import "../../styling/mainStyles.css";

export default function MemberDashboard() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [createDrop] = useMemberCreateDropMutation();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  //creates a new drop when button is clicked
  const dropCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDrop = await createDrop().unwrap();

      if (newDrop?.id) {
        navigate("/membercreatedrop", { state: { dropId: newDrop.id } });
      } else {
        console.error("Failed to create drop: Missing drop ID");
      }
    } catch (err) {
      console.error("Failed to create drop:", err);
    }
  };

  // Calculate business total fro unpaid drops
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

  function MemberCard() {
    return (
      <section>
        <h2>Hello, {member.memberName}</h2>
        {/*<p>Your are a member of the {member.business?.businessName} team</p>
        <p>Your Business Code: {member.business?.code}</p>*/}
        {/*<p>Your Team Members:</p>
        {member?.business?.businessMember?.length > 0 ? (
          member.business.businessMember.map((businessMember) => (
            <div key={businessMember.id}>
              <p>{businessMember.memberName}</p>
              {/* create a message model so members can send messages back and forth*/}
        {/*<button>Send Message</button>
            </div>
          ))
        ) : (
          <p>You have no team members yet</p>
        )}*/}
        {/*create enums for percentages, allowing a business owner to change a team members percentage*/}
        {/*<p>Percentage: {member.percentage} / 40</p>*/}
      </section>
    );
  }

  function DropCard() {
    const [payNotice, { isLoading }] = useMemberPayNoticeMutation();

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

    const allPaid = unpaidDrops?.length === 0;

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
        <h3>
          Take Home Total to Date:{" "}
          {member.drop.reduce((total, drop) => total + drop.memberCut, 0)}
        </h3>
        {/*<h3>Monthly Totals: *list totals*</h3>*/}
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
        {/* create the ability for a owner and team member to fill out a form with a message to paid amount owed*/}
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

  function NotificationCard({ member }) {
    // Extract all unique paidDrops from the member's drops
    const paidDrops = member.drop
      ?.filter((drop) => drop.paidDrop)
      .map((drop) => drop.paidDrop)
      .filter(
        (value, index, self) =>
          self.findIndex((pd) => pd.id === value.id) === index
      );

    return (
      <section>
        <h3>Payment Notifications:</h3>
        {paidDrops?.length ? (
          paidDrops.map((paidDrop) => (
            <div key={paidDrop.id}>
              <h4>Payment Received:</h4>
              <p>
                ${paidDrop.amount} from {paidDrop.payee} on{" "}
                {new Date(paidDrop.paidDate).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
              </p>
              <p>{paidDrop.paidMessage || "No message provided"}</p>

              {/* Map over the drops associated with this paidDrop */}
              <h5>Paid for Drops on:</h5>
              <ul>
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
          ))
        ) : (
          <p>No payment notifications yet.</p>
        )}
      </section>
    );
  }

  return (
    <article className="pageSetup">
      <h1>Member Dashboard</h1>
      <MemberCard />
      <DropCard />
      <button onClick={dropCreateSubmit}>Create a drop</button>
      <NotificationCard member={member} />
      {/* list drop totals for each month / functionality can be a separate component STRETCH GOAL */}
      {/* active link to navigate a team member to all drops where paid = true*/}
      <Link to={`/memberarchive`}>Your Archived Drops</Link>
    </article>
  );
}
