import React from "react";
import { useParams } from "react-router-dom";
import { useOwnerGetDropQuery } from "./ownerSlice";
import { Link } from "react-router-dom";

export default function OwnerMemberDrop() {
  const { dropId } = useParams();
  const { data: drop, error, isLoading } = useOwnerGetDropQuery(dropId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading drop data</p>;

  return (
    <article className="pageSetup">
      <h1>Member Drop</h1>
      <p>
        Team Member individual drop by id including a list of services rendered
        for that day
      </p>
      <h2>Drop Details</h2>
      <p>
        Date:{" "}
        {new Date(drop.date).toLocaleDateString("en-US", { timeZone: "UTC" })}
      </p>
      <p>Total: ${drop.total}</p>
      <h2>Drop Services:</h2>
      {drop.service.map((service) => (
        <div key={service.id}>
          <h3>{service.description}</h3>
          <p>Cash: {service.cash}</p>
          <p>Credit: {service.credit}</p>
          <p>Deposit: {service.deposit}</p>
          <p>Gift Certificate: {service.giftCertAmount}</p>
        </div>
      ))}
      <Link to={`/ownerdashboard`}>Back to Dashboard</Link>
    </article>
  );
}
