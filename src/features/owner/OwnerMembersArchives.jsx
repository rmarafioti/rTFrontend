import { useGetOwnerQuery } from "../owner/ownerSlice";
import { useOwnerGetDropsQuery } from "./ownerSlice";
import { Link } from "react-router-dom";

import styles from "../../styling/droparchives.module.css";

export default function OwnerMembersArchives() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="pageSetup">
      <h1 className={styles.header}>Drop Archives:</h1>

      {owner?.ownerBusiness?.length ? (
        <ul className={styles.drops}>
          {owner.ownerBusiness.map((business) =>
            business.businessMember?.map((member) => (
              <Link
                className={styles.date}
                to={`/ownermembersarchive/${member.id}`}
              >
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
  );
}
