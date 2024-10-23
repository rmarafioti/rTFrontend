import { Link } from "react-router-dom";

import Drop from "../../components/Drop";

import "../../styling/mainStyles.css";

export default function MemberDrop() {
  return (
    <article className="pageSetup">
      <h2>Enter your daily drop</h2>
      <Drop />
      <Link to={`/memberdashboard`}>
        <button>Submit your drop</button>
      </Link>
    </article>
  );
}
