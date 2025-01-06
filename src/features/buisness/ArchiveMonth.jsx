import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { selectMemberToken } from "../auth/authMemberSlice";
import { useGetMemberDropsQuery } from "../owner/ownerSlice";
import { useGetAllDropsQuery } from "../members/membersSlice";

import styles from "../../styling/droparchives.module.css";

dayjs.extend(utc);

export default function ArchiveMonth() {
  const { memberId, year, month } = useParams(); // Get memberId, year, and month from URL
  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  // For owners: fetch specific member's drops based on memberId, year, and month
  const {
    data: memberDropsData,
    isLoading: memberDropsIsLoading,
    error: memberDropsError,
  } = useGetMemberDropsQuery(
    { memberId, year, month },
    { skip: role !== "owner" || !memberId }
  );

  // For logged-in members: fetch their own drops for the given month and year
  const {
    data: memberData,
    isLoading: memberIsLoading,
    error: memberError,
  } = useGetAllDropsQuery(undefined, {
    skip: role !== "member",
  });

  const isLoading = memberIsLoading || memberDropsIsLoading;
  const error = memberError || memberDropsError;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const drops =
    role === "owner" && memberId ? memberDropsData?.drops : memberData?.drops;

  // Filter drops to only show those for the given month
  const filteredDrops = drops.filter((drop) => {
    const dropDate = dayjs.utc(drop.date); // Ensure we're working with UTC
    const dropYear = dropDate.year(); // Get the year of the drop
    const dropMonth = dropDate.month() + 1; // Get the month (1-based index)

    // Compare the year and month with the selected year and month
    return dropYear === parseInt(year, 10) && dropMonth === parseInt(month, 10);
  });

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        {role === "owner"
          ? `${memberDropsData?.memberDetails?.memberName}'s`
          : "Your"}{" "}
        Archived Drops
      </h1>
      {filteredDrops.length > 0 ? (
        <ul className={styles.drops}>
          {filteredDrops.map((drop) => (
            <Link className={styles.date} to={`/drop/${drop.id}`} key={drop.id}>
              <li className={styles.link}>
                {dayjs.utc(drop.date).format("MMM D, YYYY")}
              </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No drops found for this month</p>
      )}
    </article>
  );
}
