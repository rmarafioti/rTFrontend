import { useParams, Link } from "react-router-dom";
import { useGetOwnerQuery } from "./ownerSlice";

import styles from "../../styling/droparchives.module.css";

export default function OwnerMembersArchice() {
  const { memberId } = useParams();
  const { data: owner, error, isLoading } = useGetOwnerQuery(memberId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Find the member directly
  const member = owner?.ownerBusiness
    ?.map((business) => business.businessMember)
    ?.flat()
    ?.find((m) => m.id === parseInt(memberId));

  if (!member) {
    return <p>Member not found</p>;
  }

  const archivedDrops = member.drop?.filter((drop) => drop.paid);

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>{member.memberName}'s Archived Drops:</h1>
      {archivedDrops?.length ? (
        <ul className={styles.drops}>
          {archivedDrops.map((drop) => (
            <Link className={styles.date} to={`/ownermemberdrop/${drop.id}`}>
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
