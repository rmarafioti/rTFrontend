import { useLocation } from "react-router-dom";
import Drop from "../../components/member/createDrop/Drop";

import styles from "../../styling/member/createdrop.module.css";

export default function MemberCreateDrop() {
  const location = useLocation();
  const dropId = location.state?.dropId;

  return (
    <article className="pageSetup">
      <h2 className={styles.header}>Enter your daily drop.</h2>
      <Drop dropId={dropId} />
    </article>
  );
}
