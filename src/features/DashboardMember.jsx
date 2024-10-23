import { Link } from "react-router-dom";

import "../styling/mainStyles.css";

export default function Dashboard() {
  return (
    <article className="pageSetup">
      <h2>Member Dashboard</h2>
      <Link to={`/memberdrop`}>
        <button>Create a drop</button>
      </Link>
    </article>
  );
}
