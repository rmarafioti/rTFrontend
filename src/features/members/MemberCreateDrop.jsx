import { useLocation } from "react-router-dom";
import Drop from "../../components/member/createDrop/Drop";

import "../../styling/mainStyles.css";

export default function MemberCreateDrop() {
  const location = useLocation();
  const dropId = location.state?.dropId;

  console.log("Received dropId in MemberCreateDrop:", dropId);

  return (
    <article className="pageSetup">
      <h2>Enter your daily drop</h2>
      <Drop dropId={dropId} />
    </article>
  );
}
