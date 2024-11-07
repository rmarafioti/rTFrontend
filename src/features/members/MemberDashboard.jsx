import { useNavigate } from "react-router-dom";
import {
  useGetMemberQuery,
  useMemberCreateDropMutation,
} from "../../store/api";
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

  // Calculate total owed to the member by the business
  const businessOwesTotal = member.drop
    .filter((drop) => !drop.paid)
    .reduce((total, drop) => total + drop.businessOwes, 0);

  // Calculate total the member owes to the business
  const memberOwesTotal =
    businessOwesTotal > 0
      ? 0 // If the business owes the member, memberOwes should be 0
      : member.drop
          .filter((drop) => !drop.paid)
          .reduce((total, drop) => total + drop.memberOwes, 0);

  function MemberCard() {
    return (
      <section>
        <h2>Hello, {member.memberName}</h2>
        <p>Your are a member of the {member.business?.businessName} team</p>
        <p>Your Business Code: {member.business?.code}</p>
        <p>Your Team Members:</p>

        {member?.business?.businessMember?.length > 0 ? (
          member.business.businessMember.map((businessMember) => (
            <div>
              <p key={businessMember.id}>{businessMember.memberName}</p>
              <button>Send Message</button>
            </div>
          ))
        ) : (
          <p>You have no team members yet</p>
        )}

        {/* list out all team members linked to the business and map them out send them a message THIS IS A STRETCH GOAL */}

        <p>Percentage: {member.percentage} / 40</p>
      </section>
    );
  }

  function DropCard() {
    return (
      <section>
        <h3>
          Take Home Total:{" "}
          {member.drop.reduce((total, drop) => total + drop.memberCut, 0)}
        </h3>
        <h3>Monthly Totals: *list totals*</h3>
        <h3>Current Drops:</h3>
        <div className={styles.memberDrops}>
          {member?.drop?.length ? (
            member.drop
              .filter((drop) => !drop.paid)
              .map((drop) => (
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
            <p>All your drops are up to date</p>
          )}
        </div>
        <p>Owed to You: {businessOwesTotal}</p>
        <p>You Owe: {memberOwesTotal}</p>
      </section>
    );
  }

  return (
    <article className="pageSetup">
      <h1>Member Dashboard</h1>
      <MemberCard />
      <button onClick={dropCreateSubmit}>Create a drop</button>
      <DropCard />
      {/* list drop totals for each month / functionality can be a separate component STRETCH GOAL */}
      {/* active link to navigate a team member to all drops where paid = true*/}
      <Link to={`/memberarchive`}>Your Archived Drops</Link>
    </article>
  );
}
