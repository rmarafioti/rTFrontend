import { Link } from "react-router-dom";

import "../../styling/mainStyles.css";

export default function Dashboard() {
  return (
    <article className="pageSetup">
      <h1>Member Dashboard</h1>
      <h2>Hello, *member name*</h2>
      <h2>You are a member of the *business name* team</h2>
      {/*this will be a fixed active route on the navbar*/}
      <Link to={`/memberdrop`}>
        <button>Create a drop</button>
      </Link>
      <h3>Year Take Home Total:</h3>
      {/*possibly in graph form*/}
      <h3>Monthly Totals: *list totals*</h3>
      <h3>Current Drops: *list by date / link to individul drop's page*</h3>
      <h3>You Currently Owe: *balance to pay*</h3>
      <button>Pay Balance</button>
      <h3>Owed to You: *balance business owes*</h3>
      <button>Archived Drops</button>
    </article>
  );
}
