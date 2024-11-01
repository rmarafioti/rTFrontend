import { Link } from "react-router-dom";
import { useGetOwnerQuery } from "../../store/api";

import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
      <p>Username: {owner.username}</p>
      <p>Owner Name: {owner.ownerName}</p>
      <p>Take Home Total: ${owner.takeHomeTotal}</p>

      <h2>
        Your Team Members *list team members w/ active route to their profiles
        and indicator that they have current drops*
      </h2>
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
