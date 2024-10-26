import { Link } from "react-router-dom";

export default function MemberEditDrops() {
  return (
    <article className="pageSetup">
      <h1>Member Edit Drops</h1>
      <p>
        Team member can edit a drop before the owner pays out drops by the end
        of the week
      </p>
      <Link to={`/memberdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
