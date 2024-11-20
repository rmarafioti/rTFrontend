import TeamMembersCard from "../../components/owner/ownerDashboard/TeamMembersCard";
import NotificationsCard from "../../components/owner/ownerDashboard/NotificationsCard";
import MemberArchivesCard from "../../components/owner/ownerDashboard/MemberArchivesCard";
import { useGetOwnerQuery } from "./ownerSlice";
import "../../styling/mainStyles.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1>Owner Dashboard</h1>
      <h2>Welcome, {owner?.ownerName}</h2>
      <h3>
        {/*assuming an owner has onkly one business we only need to fetch the index of the sole business created rather than mapping*/}
        Take Home Total for {owner?.ownerBusiness?.[0]?.businessName}: $
        {owner?.takeHomeTotal}
      </h3>
      <TeamMembersCard />
      <NotificationsCard />
      <MemberArchivesCard />
    </article>
  );
}
