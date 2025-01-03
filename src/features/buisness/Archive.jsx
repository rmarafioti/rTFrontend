import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMemberToken } from "../auth/authMemberSlice";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { useGetAllDropsQuery } from "../buisness/businessSlice";

import styles from "../../styling/droparchives.module.css";

export default function Archive() {
  const { memberId } = useParams(); // Get memberId from URL
  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  const { data, isLoading, error, refetch } = useGetAllDropsQuery(
    role === "owner" ? memberId : null // Pass memberId only for owners
  );

  // Refetch when role or memberId changes
  useEffect(() => {
    refetch();
  }, [role, memberId, refetch]);

  if (!role) {
    return <p>Error: Unable to determine user role. Please log in again.</p>;
  }

  const drops = data?.drops || [];
  const memberName = drops.length > 0 ? drops[0].member?.memberName : null;

  dayjs.extend(utc);

  const dropsByYearAndMonth = drops.reduce((acc, drop) => {
    const date = dayjs(drop.date).utc(); // Use dayjs to ensure UTC handling
    const year = date.year();
    const month = date.month() + 1; // 0-based month in dayjs, so add 1
    const monthName = date.format("MMMM"); // Full month name

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = { monthName, drops: [] };

    acc[year][month].drops.push(drop);
    return acc;
  }, {});

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        {role === "owner" && memberId
          ? `${memberName}'s Archives`
          : "Your Archived Drops"}
      </h1>
      {Object.keys(dropsByYearAndMonth).length > 0 ? (
        Object.entries(dropsByYearAndMonth).map(([year, months]) => (
          <div key={year}>
            <ul className={styles.months}>
              {Object.entries(months).map(([month, { monthName }]) => (
                <li key={month} className={styles.month}>
                  <Link to={`/archivemonth/${year}/${month}`}>
                    {monthName} {year}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>*No drops found*</p>
      )}
    </article>
  );
}
