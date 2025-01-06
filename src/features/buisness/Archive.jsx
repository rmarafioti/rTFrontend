import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMemberToken } from "../auth/authMemberSlice";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { useGetDropsByMemberIdQuery } from "./businessSlice"; // For fetching member-specific drops
import { useGetAllDropsQuery } from "./businessSlice"; // For fetching all drops for the logged-in member

import styles from "../../styling/droparchives.module.css";

export default function Archive() {
  const { memberId } = useParams(); // Get memberId from URL
  console.log("Received memberId:", memberId); // Log memberId value

  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  const { data, isLoading, error } = useGetDropsByMemberIdQuery(memberId, {
    skip: !memberId || role !== "owner", // Skip for members or if memberId is not available
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const drops = data?.drops || [];
  const memberName = data?.memberDetails?.memberName || "Unknown Member"; // Use memberDetails from backend

  dayjs.extend(utc);

  const dropsByYearAndMonth = (drops || []).reduce((acc, drop) => {
    const date = dayjs(drop.date).utc();
    const year = date.year();
    const month = date.month() + 1;
    const monthName = date.format("MMMM");

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = { monthName, drops: [] };

    acc[year][month].drops.push(drop);
    return acc;
  }, {});

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
                  <Link
                    to={`/archivemonth/${
                      memberId || memberToken.id
                    }/${year}/${month}`}
                  >
                    {monthName} {year}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No drops found for this member</p>
      )}
    </article>
  );
}
