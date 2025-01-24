import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useGetOwnerQuery } from "./ownerSlice";
import { useUpdatePercentageMutation } from "./ownerSlice";

import styles from "../../styling/owner/ownermemberprofile.module.css";

export default function OwnerMemberProfile() {
  const { memberId } = useParams();
  const { data: owner, error, isLoading } = useGetOwnerQuery();
  const [updatePercentage] = useUpdatePercentageMutation();
  const [percentageValue, setPercentageValue] = useState("");

  const percentageValues = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Find the member directly
  const member = owner?.ownerBusiness
    ?.find((business) =>
      business.businessMember.some((member) => member.id === +memberId)
    )
    ?.businessMember.find((member) => member.id === +memberId);
  if (!member) {
    return <p>Member not found</p>;
  }

  // Handle update percentage
  const handlePercentage = async () => {
    const percentage = percentageValue[memberId];
    if (!percentageValue) {
      console.error("Please select a percentage value");
      return;
    }
    try {
      await updatePercentage({
        memberId: +memberId,
        percentage: percentageValue,
      }).unwrap();
      setPercentageValue("");
    } catch (error) {
      console.error("Error updating member percentage:", error);
    }
  };

  return (
    <article className="pageSetup">
      <h1 className={styles.header}> {member.memberName}</h1>
      <p className={styles.takeHome}>Take Home Total: {member.takeHomeTotal}</p>
      <section className={styles.memberProfileSection}>
        <section className={styles.memberCard} key={member.id}>
          <p className={styles.percent}>
            Current Percentage: {member.percentage}
          </p>
          <h2 className={styles.subHeader}>Update Member Percentage</h2>
          <section className={styles.updatePercent}>
            <select
              className={styles.select}
              value={percentageValue}
              onChange={(e) => setPercentageValue(+e.target.value)}
            >
              <option value="">Select Percentage</option>
              {percentageValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <button className={styles.percentButton} onClick={handlePercentage}>
              Update Percentage
            </button>
          </section>
        </section>
        <section className={styles.memberCard}>
          <Link className={styles.archiveLink} to={"/ownermembersarchives"}>
            <p className={styles.linkName}>Archive</p>
          </Link>
        </section>
      </section>
    </article>
  );
}
