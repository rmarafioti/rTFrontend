import TeamMembersCard from "../../components/owner/ownerDashboard/TeamMembersCard";
import NotificationsCard from "../../components/owner/ownerDashboard/NotificationsCard";
import MemberArchivesCard from "../../components/owner/ownerDashboard/MemberArchivesCard";
import { useGetOwnerQuery } from "./ownerSlice";

import "../../styling/mainStyles.css";
import styles from "../../styling/ownerdashboard.module.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1>Welcome, {owner?.ownerName}</h1>
      <section className={styles.takeHomeTotalSection}>
        <p className={styles.takeHomeKey}>
          {/*assuming an owner has only one business we only need to fetch the index of the sole business created rather than mapping*/}
          Take Home Total for {owner?.ownerBusiness?.[0]?.businessName}:{" "}
        </p>
        <p className={styles.takeHomeValue}>${owner?.takeHomeTotal}</p>
      </section>
      <TeamMembersCard />
      <NotificationsCard />
      <MemberArchivesCard />
    </article>
  );
}
