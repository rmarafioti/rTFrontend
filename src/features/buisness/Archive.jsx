import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMemberToken } from "../auth/authMemberSlice";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { useGetDropsByMemberIdQuery } from "./businessSlice"; // For owners
import { useGetAllDropsQuery } from "../members/membersSlice"; // For logged-in members

import styles from "../../styling/droparchives.module.css";

export default function Archive() {
  const { memberId } = useParams(); // Get memberId from URL
  console.log("Received memberId:", memberId); // Log memberId value

  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  // Fetch drops for a specific member (only for owners)
  const {
    data: memberDropsData,
    isLoading: memberDropsIsLoading,
    error: memberDropsError,
  } = useGetDropsByMemberIdQuery(memberId, {
    skip: !memberId || role !== "owner", // Skip if not an owner or memberId is not available
  });

  // Fetch drops for the logged-in member (if no memberId in the URL)
  const {
    data: memberData,
    isLoading: memberIsLoading,
    error: memberError,
  } = useGetAllDropsQuery(undefined, {
    skip: role !== "member", // Skip if not a member
  });

  console.log("Fetched drops:", memberData);

  const isLoading = memberIsLoading || memberDropsIsLoading;
  const error = memberError || memberDropsError;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Set drops based on whether memberId is available (for owners) or use logged-in member's drops
  const drops =
    role === "owner" && memberId ? memberDropsData?.drops : memberData?.drops;

  // Get the member name (owner's member name or the logged-in member's name)
  const memberName = memberId
    ? memberDropsData?.memberDetails?.memberName || "Unknown Member"
    : memberData?.memberDetails?.memberName || "Your Name";

  dayjs.extend(utc);

  // Group drops by year and month
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
