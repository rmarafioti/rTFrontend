import { Link } from "react-router-dom";

export default function OwnerHandleDrops() {
  return (
    <article className="pageSetup">
      <h1>Owner Handle Drops</h1>
      <p>
        features a list of members and their current drops for owner to pay out
      </p>
      <Link to={`/ownerdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
