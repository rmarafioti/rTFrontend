import { Link } from "react-router-dom";

export default function MemberDrop() {
  return (
    <article className="pageSetup">
      <h1>Member Drop</h1>
      <p>
        Team Member individual drop by id including a list of services rendered
        for that day
      </p>
      <Link to={`/memberdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
