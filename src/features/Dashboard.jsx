import Drop from "../components/Drop";

import "../styling/mainStyles.css";

export default function Dashboard() {
  return (
    <article className="pageSetup">
      <h1>Welcome to Right Track</h1>
      <h2>Dashboard</h2>
      <p>
        an app for business owners to track funds and streamline bookkeeping
      </p>
      <Drop />
    </article>
  );
}
