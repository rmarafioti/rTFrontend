import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetMemberQuery, useMemberCreateDropMutation } from "./membersSlice";
import PayNoticeCard from "../../components/member/memberDashboard/PayNoticeCard";
import MemberNotificationsCard from "../../components/member/memberDashboard/MemberNotificationsCard";

import "../../styling/mainStyles.css";
import styles from "../../styling/member/memberdashboard.module.css";

export default function MemberDashboard() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [createDrop] = useMemberCreateDropMutation();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const dropCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDrop = await createDrop().unwrap();

      if (newDrop?.id) {
        navigate("/membercreatedrop", { state: { dropId: newDrop.id } });
      } else {
        console.error("Failed to create drop: Missing drop ID");
      }
    } catch (err) {
      console.error("Failed to create drop:", err);
    }
  };

  return (
    <article className="pageSetup">
      <section className={styles.takeHomeTotalSection}>
        <h1 className={styles.header}>Welcome, {member.memberName}</h1>
        <section className={styles.totalSection}>
          <p className={styles.takeHome}>
            Take Home Total to Date: $
            {member.drop.reduce((total, drop) => total + drop.memberCut, 0)}
          </p>
          <button onClick={dropCreateSubmit} className={styles.createDrop}>
            Create a drop
          </button>
        </section>
      </section>
      <section className={styles.dashboardSections}>
        <PayNoticeCard />
        <MemberNotificationsCard />
      </section>
    </article>
  );
}
