import TeamMembersCard from "../../components/owner/ownerDashboard/TeamMembersCard";
import NotificationsCard from "../../components/owner/ownerDashboard/NotificationsCard";
import { useGetOwnerQuery } from "./ownerSlice";

import "../../styling/mainStyles.css";
import styles from "../../styling/owner/ownerdashboard.module.css";

export default function OwnerDashboard() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <section className={styles.takeHomeTotalSection}>
        <h1 className={styles.header}>Welcome, {owner?.ownerName}</h1>
        <p className={styles.takeHomeKey}>
          {owner?.ownerBusiness?.[0]?.businessName}'s Total :{" "}
        </p>
        <p className={styles.takeHomeValue}>${owner?.takeHomeTotal}</p>
      </section>
      <section className={styles.dashboardSections}>
        <TeamMembersCard />
        <NotificationsCard />
      </section>
    </article>
  );
}
