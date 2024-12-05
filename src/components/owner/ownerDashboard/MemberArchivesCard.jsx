import { useGetOwnerQuery } from "../../../features/owner/ownerSlice";
import { Link } from "react-router-dom";

import styles from "../../../styling/dashboards.module.css";

export default function MemberArchivesCard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className={styles.dashboardSection}>
      <h2 className={styles.sectionHeaders}>Drop Archives:</h2>
      <div className={styles.archivesSection}>
        {owner?.ownerBusiness?.length ? (
          <ul>
            {owner.ownerBusiness.map((business) =>
              business.businessMember?.map((member) => (
                <li className={styles.archiveName} key={member.id}>
                  <Link
                    className={styles.link}
                    to={`/ownermembersarchive/${member.id}`}
                  >
                    {member.memberName}
                  </Link>
                </li>
              ))
            )}
          </ul>
        ) : (
          <p>No Members Found</p>
        )}
      </div>
    </section>
  );
}
