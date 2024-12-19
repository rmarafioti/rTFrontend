import { useGetOwnerQuery } from "./ownerSlice";
import { useParams, Link } from "react-router-dom";

import styles from "../../styling/layout.module.css";

export default function OwnerMemberProfile() {
  const { memberId } = useParams();
  const { data: owner, error, isLoading } = useGetOwnerQuery();

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

  return (
    <article className="pageSetup">
      <h1>Owner's Member Profile Page</h1>
      <li key={member.id}>
        <p className={styles.teamMemberName}>Name: {member.memberName}</p>
        <p>Username: {member.username}</p>
        <p>Percentage: {member.percentage}</p>
        <p>Take Home Total: {member.takeHomeTotal}</p>
        <Link to={`/ownermembersarchive/${memberId}`}>
          <p> {member.memberName} Archive</p>
        </Link>
      </li>
    </article>
  );
}
