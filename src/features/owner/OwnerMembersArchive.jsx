import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetOwnerQuery } from "./ownerSlice";

import styles from "../../styling/droparchives.module.css";

export default function OwnerMembersArchice() {
  const { memberId } = useParams();
  const { data: owner, error, isLoading } = useGetOwnerQuery(memberId);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

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

  //calculate pagination
  const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentNotifications = archivedDrops.slice(firstIndex, lastIndex);

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>{member.memberName}'s Archived Drops:</h1>
      {currentNotifications?.length ? (
        <ul className={styles.drops}>
          {currentNotifications.map((drop) => (
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
      {/* pagination controls */}
      {archivedDrops.length > notificationsPerPage && (
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageControls}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of{" "}
            {Math.ceil(archivedDrops.length / notificationsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(archivedDrops.length / notificationsPerPage)
                )
              )
            }
            disabled={
              currentPage ==
              Math.ceil(archivedDrops.length / notificationsPerPage)
            }
            className={styles.pageControls}
          >
            Next
          </button>
        </div>
      )}
    </article>
  );
}
