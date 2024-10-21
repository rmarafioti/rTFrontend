import React, { useState } from "react";
import TattooCard from "./TattooCard";

//create a function to add up the total of all the services.

export default function Drop() {
  const [addedService, setAddedService] = useState([]);

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

  const dropTotal = (totals) => {
    const sum = totals.cash + totals.credit + totals.deposit + totals.giftCert;
    return sum;
  };

  const serviceTotals = calculateServiceTotals();
  const fullTotal = dropTotal(serviceTotals);

  return (
    <article className="pageSetup">
      <h1>Drop</h1>
      <p>the main section where the user will enter their daily drop</p>
      <form className="dropForm">
        <label className="labelName">Date:</label>
        <input
          className="dropFormInput"
          type="date"
          name="drop_date"
          aria-label="drop_date"
        />
        <TattooCard
          addedService={addedService}
          setAddedService={setAddedService}
        />
        <input
          className="dropFormInput"
          id="submitDrop"
          type="submit"
          value="Submit Drop"
          aria-label="form_submit"
        />
      </form>
      <div>
        <h2>Total Sevices:</h2>
        <p>Cash: ${serviceTotals.cash}</p>
        <p>Credit: ${serviceTotals.credit}</p>
        <p>Deposit: ${serviceTotals.deposit}</p>
        <p>Gift Certificate: ${serviceTotals.giftCert}</p>
      </div>
      <div>
        <h2>Drop Total:</h2>
        <p>${fullTotal}</p>
      </div>
    </article>
  );
}
