import { Link } from "react-router-dom";
import { useGetMemberQuery } from "./membersSlice";
import PayNoticeCard from "../../components/member/memberDashboard/PayNoticeCard";
import MemberNotificationsCard from "../../components/member/memberDashboard/MemberNotificationsCard";

import "../../styling/mainStyles.css";
import styles from "../../styling/member/memberdashboard.module.css";

export default function MemberDashboard() {
  const { data: member, error, isLoading } = useGetMemberQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <section className={styles.takeHomeTotalSection}>
        <h1 className={styles.header}>Welcome, {member.memberName}</h1>
        <section className={styles.totalSection}>
          <p className={styles.takeHome}>
            Take Home Total to Date: $
            {member.drop.reduce((total, drop) => total + drop.memberCut, 0)}
          </p>
          <Link to="/membercreatedrop" className={styles.createDrop}>
            Create a drop
          </Link>
        </section>
      </section>
      <section className={styles.dashboardSections}>
        <PayNoticeCard />
        <MemberNotificationsCard />
      </section>
    </article>
  );
}
