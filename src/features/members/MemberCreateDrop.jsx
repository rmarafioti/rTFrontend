import { Link, useLocation } from "react-router-dom";

import Drop from "../../components/Drop";

import "../../styling/mainStyles.css";

export default function MemberCreateDrop() {
  const location = useLocation();
  const dropId = location.state?.dropId;
  console.log("Received dropId in MemberCreateDrop:", dropId);

  if (!dropId) {
    console.error("Drop ID is missing in MemberCreateDrop.");
    return <p>Error: Drop ID is missing.</p>;
  }

  return (
    <article className="pageSetup">
      <h2>Enter your daily drop</h2>
      <Drop dropId={dropId} />
      <Link to={`/memberdashboard`}>Submit your drop</Link>
      <Link to={`/memberdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
