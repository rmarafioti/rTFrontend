import { Link } from "react-router-dom";

export default function MemberArchive() {
  return (
    <article className="pageSetup">
      <h1>Member Archive</h1>
      <p>
        Archived drops after they are paid out organized by month in drop down
        menus to view active links to individual drop dates
      </p>
      <Link to={`/ownerdashboard`}>Owner Dashboard</Link>
      <Link to={`/memberdashboard`}>Member Dashboard</Link>
    </article>
  );
}
