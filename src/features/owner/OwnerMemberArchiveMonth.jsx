import { useParams, Link } from "react-router-dom";
import { useOwnerGetDropsQuery } from "./ownerSlice";
import styles from "../../styling/droparchives.module.css";

export default function OwnerMemberArchiveMonth() {
  const { year, month, memberId } = useParams();

  const { data, error, isLoading } = useOwnerGetDropsQuery({
    memberId,
    year,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const drops = data?.drops || [];

  // Filter drops for the specific month
  const filteredDrops = drops.filter((drop) => {
    const dropDate = new Date(drop.date);
    return (
      dropDate.getFullYear() === parseInt(year, 10) &&
      dropDate.getMonth() + 1 === parseInt(month, 10) // Match month and year
    );
  });

  // Generate the name of the month dynamically
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(parseInt(year, 10), parseInt(month, 10) - 1)
  );

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        {data?.member}'s Drops for {monthName} {year}:
      </h1>
      {filteredDrops.length ? (
        <ul className={styles.drops}>
          {filteredDrops.map((drop) => (
            <Link
              className={styles.date}
              to={`/ownermemberdrop/${drop.id}`}
              key={drop.id}
            >
              <li className={styles.link}>
                {new Date(drop.date).toLocaleDateString("en-US")}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>*No drops found for this month*</p>
      )}
    </article>
  );
}
