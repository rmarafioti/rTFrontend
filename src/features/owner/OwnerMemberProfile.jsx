import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useGetOwnerQuery } from "./ownerSlice";
import { useUpdatePercentageMutation } from "./ownerSlice";

import styles from "../../styling/layout.module.css";

export default function OwnerMemberProfile() {
  const { memberId } = useParams();
  const { data: owner, error, isLoading } = useGetOwnerQuery();
  const [updatePercentage] = useUpdatePercentageMutation();
  const [percentageValue, setPercentageValue] = useState("");

  const percentageValues = [50, 55, 60, 65, 70, 75, 80, 85, 90, 100];

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
      <h1>Owner's Member Profile Page</h1>
      <li key={member.id}>
        <p className={styles.teamMemberName}>Name: {member.memberName}</p>
        <p>Username: {member.username}</p>
        <p>Percentage: {member.percentage}</p>
        <div>
          <select
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
          <button onClick={handlePercentage}>Update Percentage</button>
        </div>
        <p>Take Home Total: {member.takeHomeTotal}</p>
        <Link to={`/archive/${memberId}`}>
          <p> {member.memberName} Archive</p>
        </Link>
      </li>
    </article>
  );
}
