import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React from "react";
import { Link } from "react-router-dom";
import { useGetAllDropsQuery } from "../members/membersSlice";

import styles from "../../styling/business/archive.module.css";

dayjs.extend(utc);

export default function Archive() {
  const { data: member, isLoading, error } = useGetAllDropsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const drops = member?.drops;

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
      <h1 className={styles.header}>Your Archived Drops</h1>
      {Object.keys(dropsByYearAndMonth).length > 0 ? (
        Object.entries(dropsByYearAndMonth).map(([year, months]) => (
          <div key={year}>
            <ul className={styles.months}>
              {Object.entries(months).map(([month, { monthName }]) => (
                <Link
                  className={styles.linkName}
                  to={`/archivemonth/${member.id}/${year}/${month}`}
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
