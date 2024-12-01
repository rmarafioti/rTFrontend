import { useParams, Link } from "react-router-dom";
import { useGetOwnerQuery } from "./ownerSlice";

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
      <h2>Archived Drops for {member.memberName}</h2>
      {archivedDrops?.length ? (
        <ul>
          {archivedDrops.map((drop) => (
            <li key={drop.id}>
              <Link to={`/ownermemberdrop/${drop.id}`}>
                {new Date(drop.date).toLocaleDateString("en-US")}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No archived drops found</p>
      )}
    </article>
  );
}
