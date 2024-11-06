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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function MemberCard() {
    return (
      <section>
        <h2>Hello, {member.memberName}</h2>
        {/* delete phone and email from datebase model because we will build a messaging system */}
        <p>Phone: {member.phone}</p>
        <p>Email: {member.email}</p>
        <p>Your are a member of the {member.business?.businessName} team</p>
        <p>Your Business Code: {member.business?.code}</p>
        {/* list out all team members linked to the business and map them out send them a message THIS IS A STRETCH GOAL */}
        <p>Your Team Members:</p>
        <p>Percentage: {member.percentage} / 40</p>

        {/* break this up here and create another section called DropCard*/}

        {/* list out the date of all of the drop where paid = false */}
        {/* make each drop date an active link to naviagate to /memberdrop where me will get drop by ID and all services for the drop*/}
        <p>Current Drops:</p>
        {/* take home total should add all member totals of every drop*/}
        <p>Take Home Total: {member.takeHomeTotal}</p>
        {/* you owe total should be all memberOwe totals -  all businessOwe of every drop* if paid === no*/}
        {/* include a button to pay balance if int is > 0 : state "you have no balance at this time*/}
        <p>You Owe: {member.totalOwed}</p>
        {/* owe to you total should be all businessOwe totals -  all memberOwe of every drop if paid === no*/}
        {/* if owe to you int is > 0 else state "business to pay you" : "you are not owed anything at this time"*/}
        <p>Owed to You: {member.totalOwe}</p>
      </section>
    );
  }

  return (
    <article className="pageSetup">
      <h1>Member Dashboard</h1>
      <MemberCard />
      <button onClick={dropCreateSubmit}>Create a drop</button>
      {/* list drop totals for each month / functionality can be a separate component STRETCH GOAL */}
      <h3>Monthly Totals: *list totals*</h3>

      {/* edit drop functionality will be located on the member drop page instead of here */}
      {/*<Link to={`/membereditdrops`}>Edit Drops</Link>*/}
      {/* active link to navigate a team member to all drops where paid = true*/}
      <Link to={`/memberarchive`}>Your Archived Drops</Link>
    </article>
  );
}
