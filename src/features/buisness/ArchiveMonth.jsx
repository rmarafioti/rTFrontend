import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { selectMemberToken } from "../auth/authMemberSlice";
import { useGetMemberDropsQuery } from "../owner/ownerSlice";
import { useGetAllDropsQuery } from "../members/membersSlice";
import Pagination from "../../components/Pagination";

import styles from "../../styling/business/archivemonth.module.css";

dayjs.extend(utc);

export default function ArchiveMonth() {
  const { memberId, year, month } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 18;

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
  } = useGetMemberDropsQuery(
    { memberId, year, month },
    { skip: role !== "owner" || !memberId }
  );

  // For logged-in members: fetch their own drops for the given month and year
  const {
    data: memberData,
    isLoading: memberIsLoading,
    error: memberError,
  } = useGetAllDropsQuery(
    { year, month },
    {
      skip: role !== "member",
    }
  );

  const isLoading = memberIsLoading || memberDropsIsLoading;
  const error = memberError || memberDropsError;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Define the data that we are using by the role of the logged in user
  const drops =
    role === "owner" && memberId ? memberDropsData?.drops : memberData?.drops;

  // Filter drops to only show those for the given month
  const filteredDrops = drops.filter((drop) => {
    const dropDate = dayjs.utc(drop.date);
    const dropYear = dropDate.year();
    const dropMonth = dropDate.month() + 1; // Add 1 because months are 0-based

    console.log("All Drops:", drops);

    // Compare the year and month with the selected year and month
    return dropYear === parseInt(year, 10) && dropMonth === parseInt(month, 10);
  });

  console.log("Filtered Drops:", filteredDrops);

  const monthTotal = filteredDrops.reduce((acc, drop) => acc + drop.total, 0);
  const memberTotal = monthTotal * 0.6;
  const businessTotal = monthTotal * 0.4;

  const memberName =
    role === "owner"
      ? memberDropsData?.memberDetails?.memberName
      : memberData?.drops[0]?.member?.memberName;

  // Calculate pagination
  const lastIndex = currentPage * notificationsPerPage;
  const firstIndex = lastIndex - notificationsPerPage;
  const currentDrops = filteredDrops.slice(firstIndex, lastIndex);

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        {role === "owner" ? `${memberName}'s Drops` : `Your Month's Drops`}
      </h1>

      <section className={styles.monthSection}>
        <h2 className={styles.monthTotal}>Month Total: {monthTotal}</h2>
        <p className={styles.memberTotal}>
          {memberName ? `${memberName}'s` : "Your"} Total: {memberTotal}
        </p>
        <p className={styles.businessTotal}>
          Business's Total: {businessTotal}
        </p>
        {currentDrops.length > 0 ? (
          <ul className={styles.drops}>
            {currentDrops.map((drop) => (
              <Link
                className={styles.date}
                to={`/drop/${drop.id}`}
                key={drop.id}
              >
                <li className={styles.link}>
                  {dayjs.utc(drop.date).format("MMM D, YYYY")}
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No drops found for this month</p>
        )}
      </section>
      {filteredDrops.length <= 18 ? (
        " "
      ) : (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredDrops.length}
          itemsPerPage={notificationsPerPage}
        />
      )}
    </article>
  );
}
