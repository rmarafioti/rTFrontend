import { Link } from "react-router-dom";

export default function MemberHandleDrops() {
  return (
    <article className="pageSetup">
      <h1>Member Handle Drops</h1>
      <p>
        Team member can log a payment message to notify owner that the current
        drops have been paid if there is a member balance
      </p>
      <Link to={`/memberdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
