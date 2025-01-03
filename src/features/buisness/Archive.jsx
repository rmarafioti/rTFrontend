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

  console.log("Role:", role);
  console.log("Member ID:", memberId);

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

  const dropsByYearAndMonth = drops.reduce((acc, drop) => {
    const date = new Date(drop.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date);

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
          ? `Archived Drops for Team Member ${memberId}`
          : "Your Archived Drops"}
      </h1>
      {Object.keys(dropsByYearAndMonth).length > 0 ? (
        Object.entries(dropsByYearAndMonth).map(([year, months]) => (
          <div key={year}>
            <h2>{year}</h2>
            <ul className={styles.months}>
              {Object.entries(months).map(([month, { monthName, drops }]) => (
                <li key={month} className={styles.month}>
                  <h3>
                    {monthName} {year}
                  </h3>
                  <ul>
                    {drops.map((drop) => (
                      <li key={drop.id} className={styles.drop}>
                        <Link to={`/drop/${drop.id}`}>
                          {new Date(drop.date).toLocaleDateString("en-US")}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
