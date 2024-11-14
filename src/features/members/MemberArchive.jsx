import { Link } from "react-router-dom";
import { useMemberGetPaidDropsQuery } from "./membersSlice";

export default function MemberArchive() {
  const { data: paidDrops, error, isLoading } = useMemberGetPaidDropsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1>Your Archived Drops</h1>
      {paidDrops.length ? (
        paidDrops.map((drop) => (
          <div key={drop.id}>
            <Link to={`/memberdrop/${drop.id}`} key={drop.id}>
              Drop Date:{" "}
              {new Date(drop.date).toLocaleDateString("en-US", {
                timeZone: "UTC",
              })}
            </Link>
          </div>
        ))
      ) : (
        <p>No archived drops found.</p>
      )}
      <Link to={`/memberdashboard`}>Member Dashboard</Link>
    </article>
  );
}
