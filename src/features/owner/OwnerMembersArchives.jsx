import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useGetOwnerQuery } from "../owner/ownerSlice";
import { Link } from "react-router-dom";

import "../../styling/mainStyles.css";
import styles from "../../styling/owner/ownermembersarchives.module.css";

dayjs.extend(utc);

export default function OwnerMembersArchives() {
  const { data: owner, error, isLoading } = useGetOwnerQuery();

  console.log("Owner Data:", owner);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!owner?.ownerBusiness?.length) return <p>No Members Found</p>;

  // Map through owner businesses and members to group drops by year and month
  const membersWithDrops = owner.ownerBusiness
    .map((business) =>
      (business.businessMember || []).map((member) => {
        const dropsByYearAndMonth = (member.drop || []).reduce((acc, drop) => {
          const dropDate = dayjs(drop.date).utc();
          const year = dropDate.year();
          const month = dropDate.month() + 1;
          const monthName = dropDate.format("MMMM");

          if (!acc[year]) acc[year] = {};
          if (!acc[year][month]) acc[year][month] = { monthName, month };

          return acc;
        }, {});

        return { member, dropsByYearAndMonth };
      })
    )
    .reduce((acc, current) => acc.concat(current), []);

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Drop Archives:</h1>
      <ul className={styles.drops}>
        {membersWithDrops.map(({ member, dropsByYearAndMonth }) => (
          <li key={member?.id || "unknown"} className={styles.memberCard}>
            <h2 className={styles.memberName}>
              {member?.memberName || "Unknown Member"}
            </h2>
            {Object.keys(dropsByYearAndMonth).length > 0 ? (
              Object.entries(dropsByYearAndMonth).map(([year, months]) => (
                <div className={styles.monthsContainer} key={year}>
                  <ul className={styles.months}>
                    {Object.entries(months).map(
                      ([monthNumber, { monthName }]) => (
                        <Link
                          key={monthNumber}
                          to={`/archivemonth/${
                            member?.id || "unknown"
                          }/${year}/${monthNumber}`}
                          className={styles.linkName}
                        >
                          <li className={styles.link}>
                            {monthName} {year}
                          </li>
                        </Link>
                      )
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className={styles.noDrops}>No drops found</p>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
