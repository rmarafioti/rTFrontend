import React, { useState } from "react";
import ServiceCard from "./ServiceCard";
import { useMemberCreateServiceMutation } from "../store/api";
import styles from "../styling/drop.module.css";

export default function Drop({ dropId }) {
  console.log("Received dropId in Drop:", dropId);

  const [addedService, setAddedService] = useState([]);
  const [createService] = useMemberCreateServiceMutation();

  // Function to add up totals for all added services
  const calculateServiceTotals = () => {
    return addedService.reduce(
      (acc, service) => {
        acc.cash += Number(service.cash);
        acc.credit += Number(service.credit);
        acc.deposit += Number(service.deposit);
        acc.giftCert += Number(service.giftCert);
        return acc;
      },
      { cash: 0, credit: 0, deposit: 0, giftCert: 0 }
    );
  };

  // Totals for display
  const serviceTotals = calculateServiceTotals();
  const fullTotal =
    serviceTotals.cash +
    serviceTotals.credit +
    serviceTotals.deposit +
    serviceTotals.giftCert;
  const yourTotal = fullTotal * 0.6;
  const shopTotal = fullTotal - yourTotal;
  const shopOwesTotal =
    yourTotal - (serviceTotals.cash || 0) - (serviceTotals.deposit || 0);
  const teamMemberOwesTotal =
    shopTotal - (serviceTotals.credit || 0) - (serviceTotals.giftCert || 0);

  // Submit all services to the backend
  const submitServices = async () => {
    try {
      for (const service of addedService) {
        const serviceData = {
          ...service,
          cash: service.cash || 0,
          credit: service.credit || 0,
          deposit: service.deposit || 0,
          giftCertAmount: service.giftCertAmount || 0,
        };
        await createService({ dropId, ...serviceData }).unwrap();
      }
      console.log("All services added successfully");
      setAddedService([]); // Clear after submission
    } catch (error) {
      console.error("Error adding services:", error);
    }
  };

  return (
    <article className="pageSetup">
      <p>Enter your daily drop</p>
      <form className={styles.dropForm}>
        <label className={styles.labelName}>Date:</label>
        <input
          className={styles.dropFormInput}
          type="date"
          name="drop_date"
          aria-label="drop_date"
        />
        <ServiceCard
          addedService={addedService}
          setAddedService={setAddedService}
          dropId={dropId}
        />
      </form>
      <button onClick={submitServices}>Submit All Services</button>

      <section className={styles.totalsSection}>
        <div className={styles.totalServices}>
          <h2>Service Totals:</h2>
          <p>Cash: ${serviceTotals.cash}</p>
          <p>Credit: ${serviceTotals.credit}</p>
          <p>Deposit: ${serviceTotals.deposit}</p>
          <p>Gift Certificate: ${serviceTotals.giftCert}</p>
        </div>
        <div className={styles.dropTotal}>
          <h2>Drop Total:</h2>
          <p>${fullTotal}</p>
        </div>
        <div className={styles.percentageTotals}>
          <h2>Your Total:</h2>
          <p>${yourTotal}</p>
          <h2>Shop Total:</h2>
          <p>${shopTotal}</p>
        </div>
        <div className={styles.cutTotals}>
          <h2>Shop Owes:</h2>
          <p>${shopOwesTotal}</p>
          <h2>You Owe The Shop:</h2>
          <p>${teamMemberOwesTotal}</p>
        </div>
      </section>
    </article>
  );
}
