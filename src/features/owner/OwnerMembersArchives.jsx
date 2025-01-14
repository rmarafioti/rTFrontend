import { useGetOwnerQuery } from "../owner/ownerSlice";
import { Link } from "react-router-dom";

import "../../styling/mainStyles.css";
import styles from "../../styling/owner/ownermembersarchives.module.css";

export default function OwnerMembersArchives() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Drop Archives:</h1>
      <section className={styles.dropSection}>
        {owner?.ownerBusiness?.length ? (
          <ul className={styles.drops}>
            {owner.ownerBusiness.map((business) =>
              business.businessMember?.map((member) => (
                <Link className={styles.linkName} to={`/archive/${member.id}`}>
                  <li className={styles.link} key={member.id}>
                    {member.memberName}
                  </li>
                </Link>
              ))
            )}
          </ul>
        ) : (
          <p>No Members Found</p>
        )}
      </section>
    </article>
  );
}
