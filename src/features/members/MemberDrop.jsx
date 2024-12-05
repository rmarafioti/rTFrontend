import React from "react";
import { useParams } from "react-router-dom";
import { useMemberGetDropQuery } from "./membersSlice";
import { Link } from "react-router-dom";

import styles from "../../styling/dropdetails.module.css";

export default function MemberDrop() {
  const { dropId } = useParams();
  const { data: drop, error, isLoading } = useMemberGetDropQuery(dropId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading drop data</p>;

  return (
    <article className="pageSetup">
      <div className={styles.headerSection}>
        <h1 className={styles.header}>Drop Details</h1>
        <p className={styles.date}>
          {new Date(drop.date).toLocaleDateString("en-US", { timeZone: "UTC" })}
        </p>
        <p className={styles.total}>Total: ${drop.total}</p>
        {drop.memberOwes !== 0 && (
          <p className={styles.oweAmounts}>You Owe: ${drop.memberOwes}</p>
        )}
        {drop.businessOwes !== 0 && (
          <p className={styles.oweAmounts}>Owed to You: ${drop.businessOwes}</p>
        )}
        <p className={styles.oweAmounts}>
          {drop.paid === true ? "*PAID*" : "*NOT PAID*"}
        </p>
      </div>
      <h2>Services:</h2>
      {drop.service.map((service) => (
        <div className={styles.service} key={service.id}>
          <h3 className={styles.description}>{service.description}</h3>
          {service.cash !== 0 && <p>Cash: ${service.cash}</p>}
          {service.credit !== 0 && <p>Credit: ${service.credit}</p>}
          {service.deposit !== 0 && <p>Deposit: ${service.deposit}</p>}
          {service.giftCertAmount !== 0 && (
            <p>Gift Certificate: ${service.giftCertAmount}</p>
          )}
        </div>
      ))}
      <Link className={styles.link} to={`/memberdashboard`}>
        Back to Dashboard
      </Link>
    </article>
  );
}
