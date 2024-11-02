import { useGetMemberQuery } from "../../store/api";
import { Link } from "react-router-dom";

import "../../styling/mainStyles.css";

export default function MemberDashboard() {
  const { data: member, error, isLoading } = useGetMemberQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function MemberCard() {
    return (
      <section>
        <h2>Hello, {member.memberName}</h2>
        <p>Phone: {member.phone}</p>
        <p>Email: {member.email}</p>
        <p>Your are a member of the {member.business?.businessName} team</p>
        <p>Your Business Code: {member.business?.code}</p>
        <p>Percentage: {member.percentage}</p>
        <p>Take Home Total: {member.takeHomeTotal}</p>
        <p>You Owe: {member.totalOwed}</p>
        <p>Owed to You: {member.totalOwe}</p>
      </section>
    );
  }

  return (
    <article className="pageSetup">
      <h1>Member Dashboard</h1>
      <MemberCard />
      {/*this will be a fixed active route on the navbar*/}
      <Link to={`/membercreatedrop`}>Create a drop</Link>
      {/*possibly in graph form*/}
      <h3>Monthly Totals: *list totals*</h3>
      <h3>Current Drops: *list by date / link to individul drop's page*</h3>
      <Link to={`/membereditdrops`}>Edit Drops</Link>
      <h3>You Currently Owe: *balance to pay*</h3>
      <Link to={`/memberhandledrops`}>Pay Balance</Link>
      <h3>Owed to You: *balance business owes*</h3>
      <Link to={`/memberarchive`}>Your Archived Drops</Link>
    </article>
  );
}
