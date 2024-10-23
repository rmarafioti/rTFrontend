import { Link } from "react-router-dom";

export default function Home() {
  return (
    <article className="pageSetup">
      <h1>Welcome to Right Track</h1>
      <p>
        an app for business owners and team members to track funds and
        streamline bookkeeping
      </p>
      <p>Are you a business owner?</p>
      <Link to={`/authowner`}>
        <button>Owner Login</button>
      </Link>
      <p>Are you a team member?</p>
      <Link to={`/authmember`}>
        <button>Team Member Login</button>
      </Link>
    </article>
  );
}
