import { Link } from "react-router-dom";
import { useGetOwnerQuery } from "./ownerSlice";

import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // map out the team members and show a list of their current drops, create a form to pay drops which them with change the paid boolean expression to true
  function BusinessMembersCard() {
    return (
      <section>
        <h2>Your Team Members</h2>
        {owner?.ownerBusiness?.length ? (
          owner.ownerBusiness.map((business) => (
            <div key={business.id} className="business-card">
              <h3>{business.businessName}</h3>
              <ul>
                {business.businessMember?.length ? (
                  business.businessMember.map((member) => (
                    <li key={member.id}>
                      <p>{member.memberName}</p>
                      <p>Owed: {member.totalOwe}</p>
                      <p>Pay: {member.totalOwed}</p>
                    </li>
                  ))
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
      <Link to={`/ownerhandledrops`}>
        *Pay Balance for each member that has current drops*
      </Link>
      <h3>Year Take Home Total:</h3>
      {/*possibly in graph form*/}
      <h3>Monthly Totals: *list totals*</h3>
    </article>
  );
}
