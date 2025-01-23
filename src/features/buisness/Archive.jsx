import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMemberToken } from "../auth/authMemberSlice";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { useGetDropsByMemberIdQuery } from "./businessSlice"; // For owners
import { useGetAllDropsQuery } from "../members/membersSlice"; // For logged-in members

import styles from "../../styling/business/archive.module.css";

dayjs.extend(utc);

export default function Archive() {
  const { memberId } = useParams();

  // This file is a shared feature between owner and team members so we need to check if token are present
  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  // Then define the user's role based on token presence
  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  // For owners: fetch specific member's drops based on memberId, year, and month
  const {
    data: memberDropsData,
    isLoading: memberDropsIsLoading,
    error: memberDropsError,
  } = useGetDropsByMemberIdQuery(memberId, {
    skip: !memberId || role !== "owner", // Skip if not an owner or memberId is not available
  });

  // For logged-in members: fetch their own drops for the given month and year
  const {
    data: memberData,
    isLoading: memberIsLoading,
    error: memberError,
  } = useGetAllDropsQuery(undefined, {
    skip: role !== "member", // Skip if not a member
  });

  const isLoading = memberIsLoading || memberDropsIsLoading;
  const error = memberError || memberDropsError;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Define the data that we are using by the role of the logged in user
  const drops =
    role === "owner" && memberId ? memberDropsData?.drops : memberData?.drops;

  // Fetch the team mebers name if the owner is logged in
  const memberName = memberId
    ? memberDropsData?.memberDetails?.memberName || "Unknown Member"
    : "";

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
                <Link
                  className={styles.linkName}
                  to={`/archivemonth/${
                    memberId || memberToken.id
                  }/${year}/${month}`}
                >
                  <li key={month} className={styles.link}>
                    {monthName} {year}
                  </li>
                </Link>
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
