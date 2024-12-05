import { Link } from "react-router-dom";
import { useMemberGetPaidDropsQuery } from "./membersSlice";

import styles from "../../styling/droparchives.module.css";

export default function MemberArchive() {
  const { data: paidDrops, error, isLoading } = useMemberGetPaidDropsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Your Archived Drops</h1>
      {paidDrops?.length ? (
        <ul className={styles.drops}>
          {paidDrops.map((drop) => (
            <Link className={styles.date} to={`/memberdrop/${drop.id}`}>
              <li key={drop.id} className={styles.link}>
                {new Date(drop.date).toLocaleDateString("en-US")}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>*No archived drops found*</p>
      )}
    </article>
  );
}
