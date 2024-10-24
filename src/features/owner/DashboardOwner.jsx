import "../../styling/mainStyles.css";

export default function DashboardOwner() {
  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
      <h2>
        Your Team Members *list team members w/ active route to their profiles
        and indicator that they have current drops*
      </h2>
      <button>Pay Balance *for each member that has current drops*</button>
      <h3>Year Take Home Total:</h3>
      {/*possibly in graph form*/}
      <h3>Monthly Totals: *list totals*</h3>
    </article>
  );
}
