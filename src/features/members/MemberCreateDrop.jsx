import { Link } from "react-router-dom";

import Drop from "../../components/Drop";

import "../../styling/mainStyles.css";

export default function MemberCreateDrop() {
  return (
    <article className="pageSetup">
      <h2>Enter your daily drop</h2>
      <Drop />
      <Link to={`/memberdashboard`}>Submit your drop</Link>
      <Link to={`/memberdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
