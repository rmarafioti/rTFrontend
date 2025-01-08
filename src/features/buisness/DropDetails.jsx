import React from "react";
import { useSelector } from "react-redux";
import { selectMemberToken } from "../auth/authMemberSlice";
import { selectOwnerToken } from "../auth/authOwnerSlice";
import { useParams } from "react-router-dom";
import { useGetDropsQuery } from "./businessSlice";

import "../../styling/mainStyles.css";
import styles from "../../styling/business/dropdetails.module.css";

export default function Drop() {
  const { dropId } = useParams();
  const { data: drop, error, isLoading } = useGetDropsQuery(dropId);

  // This file is a shared feature between owner and team members so we need to check if token are present
  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  // Then define the user's role based on token presence
  const role = ownerToken ? "owner" : memberToken ? "member" : null;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading drop data</p>;

  return (
    <article className="pageSetup">
      <div className={styles.headerSection}>
        <h1 className={styles.header}>Drop Details.</h1>
        <p className={styles.date}>
          {new Date(drop.date).toLocaleDateString("en-US", { timeZone: "UTC" })}
        </p>
        <div className={styles.dropDetails}>
          <p className={styles.total}>Total: ${drop.total}</p>
          {drop.memberOwes !== 0 && (
            <p className={styles.oweAmounts}>You Owe: ${drop.memberOwes}</p>
          )}
          {drop.businessOwes !== 0 && (
            <p className={styles.oweAmounts}>
              Owed to You: ${drop.businessOwes}
            </p>
          )}
          <p
            className={`${styles.oweAmounts} ${
              drop.paid ? styles.paid : styles.notPaid
            }`}
          >
            {drop.paid && drop.paidDrop?.paidDate
              ? `*PAID* on ${new Date(
                  drop.paidDrop.paidDate
                ).toLocaleDateString("en-US", { timeZone: "UTC" })}`
              : "*NOT PAID*"}
          </p>
        </div>
      </div>
      <h2 className={styles.subHeadersNotice}>Services:</h2>
      {drop.service.map((service) => (
        <section className={styles.serviceSection}>
          <h3 className={styles.description}>{service.description}</h3>
          <div className={styles.service} key={service.id}>
            {service.cash !== 0 && <p>Cash: ${service.cash}</p>}
            {service.credit !== 0 && <p>Credit: ${service.credit}</p>}
            {service.deposit !== 0 && <p>Deposit: ${service.deposit}</p>}
            {service.giftCertAmount !== 0 && (
              <p>Gift Certificate: ${service.giftCertAmount}</p>
            )}
          </div>
        </section>
      ))}
    </article>
  );
}
