import React, { useState } from "react";
import TattooCard from "./TattooCard";

import styles from "../styling/drop.module.css";

/**
 *
 * @returns the drop section of the application where a team member can enter in their services
 */
export default function Drop() {
  const [addedService, setAddedService] = useState([]);

  //create a function to track the total of each formValue when a service is added.
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

  const serviceTotals = calculateServiceTotals();

  //create a function to add up the total of all the services.
  const dropTotal = (totals) => {
    const sum = totals.cash + totals.credit + totals.deposit + totals.giftCert;
    return sum;
  };

  const fullTotal = dropTotal(serviceTotals);

  //create a function to calculate the team members cut - hardcoded 60%
  const teamMemberTotal = () => {
    const sum = fullTotal * 0.6;
    return sum;
  };

  const yourTotal = teamMemberTotal();

  //create a function to calculate the business' cut
  const businessTotal = () => {
    const businessSum = fullTotal - yourTotal;
    return businessSum;
  };

  const shopTotal = businessTotal();

  //create a function to calculate what the business owes the team member
  const shopOwes = (cash, deposit) => {
    //your total - cash and deposits = shop owes
    const shopOwesSum = yourTotal - (cash || 0) - (deposit || 0);
    //else if shopOwesSum < 0 return 0
    return shopOwesSum < 0 ? 0 : shopOwesSum;
  };

  const shopOwesTotal = shopOwes(serviceTotals.cash, serviceTotals.deposit);

  //create a function to calculate what the team member owes the business
  const teamMemberOwes = (credit, giftCert) => {
    //your total - credit and giftCerts = team member owes
    const teamMemberOwesSum = shopTotal - (credit || 0) - (giftCert || 0);
    //else if teamMemberOwesSum < 0 return 0
    return teamMemberOwesSum < 0 ? 0 : teamMemberOwesSum;
  };

  const teamMemberOwesTotal = teamMemberOwes(
    serviceTotals.credit,
    serviceTotals.giftCert
  );

  return (
    <article className="pageSetup">
      <p>the main section where the user will enter their daily drop</p>
      <form className={styles.dropForm}>
        <label className={styles.labelName}>Date:</label>
        <input
          className={styles.dropFormInput}
          type="date"
          name="drop_date"
          aria-label="drop_date"
        />
        <TattooCard
          addedService={addedService}
          setAddedService={setAddedService}
        />
        {/*
        keep thsi out until we implement backend routes
        <input
          className="dropFormInput"
          id="submitDrop"
          type="submit"
          value="Submit Drop"
          aria-label="form_submit"
        />*/}
      </form>
      <section className={styles.totalsSection}>
        <div className={styles.totalServices}>
          <h2>Sevice Totals:</h2>
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
