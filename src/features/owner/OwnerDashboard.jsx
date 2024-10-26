import { Link } from "react-router-dom";

import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
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
