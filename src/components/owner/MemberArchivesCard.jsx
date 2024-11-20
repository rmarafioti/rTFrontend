import { useGetOwnerQuery } from "../../features/owner/ownerSlice";
import { Link } from "react-router-dom";

export default function MemberArchivesCard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section>
      <h2>Team Member Archives</h2>
      {owner?.ownerBusiness?.length ? (
        <ul>
          {owner.ownerBusiness.map((business) =>
            business.businessMember?.map((member) => (
              <li key={member.id}>
                <Link to={`/ownermembersarchive/${member.id}`}>
                  {member.memberName}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : (
        <p>No Members Found</p>
      )}
    </section>
  );
}
