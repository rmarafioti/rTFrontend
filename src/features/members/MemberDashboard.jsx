import { useNavigate } from "react-router-dom";
import {
  useGetMemberQuery,
  useMemberCreateDropMutation,
} from "../../store/api";
import { Link } from "react-router-dom";

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

  //navigates the user to drop page by its id when clicked
  const getDropSubmit = async (e) => {};

  function MemberCard() {
    return (
      <section>
        <h2>Hello, {member.memberName}</h2>
        <p>Your are a member of the {member.business?.businessName} team</p>
        <p>Your Business Code: {member.business?.code}</p>
        {/* list out all team members linked to the business and map them out send them a message THIS IS A STRETCH GOAL */}
        <p>Your Team Members:</p>
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
        {/* make each drop date an active link to naviagate to /memberdrop where me will get drop by ID and all services for the drop*/}
        <h3>Current Drops:</h3>
        {member?.drop?.length ? (
          member.drop
            .filter((drop) => !drop.paid)
            .map((drop) => (
              <Link to={`/memberdrop/${drop.id}`} key={drop.id}>
                {new Date(drop.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
              </Link>
            ))
        ) : (
          <p>You have no drops at this time</p>
        )}
        <p>
          Owed to You:{" "}
          {member.drop
            .filter((drop) => !drop.paid)
            .reduce((total, drop) => total + drop.businessOwes, 0)}
        </p>
        <p>
          You Owe:{" "}
          {member.drop
            .filter((drop) => !drop.paid)
            .reduce((total, drop) => total + drop.memberOwes, 0)}
        </p>
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
      {/* edit drop functionality will be located on the member drop page instead of here */}
      {/*<Link to={`/membereditdrops`}>Edit Drops</Link>*/}
      {/* active link to navigate a team member to all drops where paid = true*/}
      <Link to={`/memberarchive`}>Your Archived Drops</Link>
    </article>
  );
}
