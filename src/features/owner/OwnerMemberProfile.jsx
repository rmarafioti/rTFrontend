import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useGetOwnerQuery } from "./ownerSlice";
import { useUpdatePercentageMutation } from "./ownerSlice";

import styles from "../../styling/owner/ownermemberprofile.module.css";

dayjs.extend(utc);

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

  // Ensure member.drops is an array
  const drops = member?.drop || [];

  // Map through owner businesses and members to group drops by year and month
  const dropsByYearAndMonth = drops.reduce((acc, drop) => {
    const dropDate = dayjs(drop.date).utc();
    const year = dropDate.year();
    const month = dropDate.month() + 1;
    const monthName = dropDate.format("MMMM");

    // Ensure memberCut is a valid number
    const memberCut = Number(drop.memberCut) || 0;

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) {
      acc[year][month] = { monthName, month, drops: [], totalMemberCut: 0 };
    }

    // Add the drop to the corresponding year and month
    acc[year][month].drops.push(drop);

    // Accumulate the total memberCut for the month
    acc[year][month].totalMemberCut += drop?.memberCut || 0;

    return acc;
  }, {});

  console.log(dropsByYearAndMonth);

  // Handle update percentage
  const handlePercentage = async () => {
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
      <section className={styles.takeHomeSection}>
        <p className={styles.takeHome}>
          Take Home Total: {member.takeHomeTotal}
        </p>
      </section>
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
        <section className={styles.memberCard} id={styles.monthTotalsSection}>
          {Object.entries(dropsByYearAndMonth).map(([year, months]) => (
            <div key={year}>
              {Object.values(months).map(
                ({ monthName, month, totalMemberCut }) => (
                  <div key={month}>
                    <p className={styles.monthTotals}>
                      {monthName} {year} -{" "}
                      {`Total: $${totalMemberCut.toFixed(2)}`}
                    </p>
                  </div>
                )
              )}
            </div>
          ))}
          <Link className={styles.archiveLink} to={"/ownermembersarchives"}>
            <p className={styles.linkName}>Archive</p>
          </Link>
        </section>
      </section>
    </article>
  );
}
