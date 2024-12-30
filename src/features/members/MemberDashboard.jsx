import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetMemberQuery, useMemberCreateDropMutation } from "./membersSlice";
import PayNoticeCard from "../../components/member/memberDashboard/PayNoticeCard";
import MemberNotificationsCard from "../../components/member/memberDashboard/MemberNotificationsCard";

import "../../styling/mainStyles.css";
import styles from "../../styling/dashboards.module.css";

export default function MemberDashboard() {
  const { data: member, error, isLoading } = useGetMemberQuery();
  const [createDrop] = useMemberCreateDropMutation();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  //creates a new drop when button is clicked
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
        <p className={styles.takeHomeKey}>Take Home Total to Date: </p>
        <p className={styles.takeHomeValue}>
          ${member.drop.reduce((total, drop) => total + drop.memberCut, 0)}
        </p>
      </section>
      <button onClick={dropCreateSubmit} className={styles.createDrop}>
        Create a drop
      </button>
      <PayNoticeCard />
      <MemberNotificationsCard />
      <Link to="/membernotifications/" className={styles.link}>
        View all payments
      </Link>
    </article>
  );
}
