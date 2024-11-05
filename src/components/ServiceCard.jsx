import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

import styles from "../styling/serviceCard.module.css";

export default function ServiceCard({ dropId, addedService, setAddedService }) {
  console.log("Received dropId in ServiceCard:", dropId);
  // create a variable named serviceInput which is a object of key value pairs the users will input values to via the service form
  const serviceInput = {
    description: "",
    cash: "",
    credit: "",
    deposit: "",
    giftCert: "",
  };

  //create a validation errror if no description is entered
  const inputValidationError = {
    description: false,
  };

  // setter and a getter to set user values from the input form
  const [formValues, setFormValues] = useState(serviceInput);
  //setter and getter for validation error
  const [validationError, setValidationError] = useState(inputValidationError);

  //validate description field
  const validateField = (field, value) => {
    let isValid = true;
    if (field === "description") {
      isValid = value.trim() !== "";

      setValidationError({
        ...validationError,
        description: !isValid,
      });
    }
    return isValid;
  };

  //function to handle input changes and update formValues
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]:
        name === "cash" ||
        name === "credit" ||
        name === "deposit" ||
        name === "giftCert"
          ? //change to parseFloat() for decimal values
            parseInt(value) || 0 // Ensure the value is parsed as a number
          : value, // For text fields like description
    });
  };

  //create a function addService to place team member input for a service into the addedServive array
  const addService = (e) => {
    e.preventDefault();
    const isDescriptionValid = validateField(
      "description",
      formValues.description
    );
    if (isDescriptionValid) {
      setAddedService([...addedService, formValues]);
      setFormValues(serviceInput);
    }
  };

  //create a function removeService so a team member will be able to remove an added service
  const removeService = (index) => {
    const newAddedServices = addedService.filter((_, i) => i !== index);
    setAddedService(newAddedServices);
  };

  return (
    <article className="pageSetup">
      <h1>Service</h1>
      <form className={styles.serviceForm}>
        <label className={styles.labelName}>
          Description:{" "}
          {validationError.description && (
            <p>*please enter a name for this service</p>
          )}
        </label>
        <input
          className={styles.serviceFormInput}
          type="text"
          name="description"
          aria-label="service description"
          value={formValues.description}
          onChange={handleInputChange}
          required
        />
        <div className={styles.serviceFormSection}>
          <label className={styles.labelName}>Cash: </label>
          <input
            className={styles.serviceFormInput}
            id={styles.cashInput}
            type="number"
            name="cash"
            aria-label="cash amount"
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
            value={formValues.cash}
            onChange={handleInputChange}
          />
          <label className={styles.labelName}>Credit: </label>
          <input
            className={styles.serviceFormInput}
            id={styles.creditInput}
            type="number"
            name="credit"
            aria-label="credit amount"
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
            value={formValues.credit}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.serviceFormSection}>
          <label className={styles.labelName}>Deposit: </label>
          <input
            className={styles.serviceFormInput}
            id={styles.depositInput}
            type="number"
            name="deposit"
            aria-label="deposit"
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
            value={formValues.deposit}
            onChange={handleInputChange}
          />
          <label className={styles.labelName}>Gift Certificate: </label>
          <input
            className={styles.serviceFormInput}
            id={styles.giftcertInput}
            type="number"
            name="giftCert"
            aria-label="giftCert"
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
            value={formValues.giftCert}
            onChange={handleInputChange}
          />
        </div>
        <button
          className={styles.serviceFormInput}
          id={styles.addService}
          aria-label="form_submit"
          onClick={addService}
        >
          Add Service
        </button>
      </form>
      <section>
        <h2>Added Services:</h2>
        <div>
          {addedService.map((service, index) => (
            <div key={index}>
              {service.description} - Cash: ${service.cash}, Credit: $
              {service.credit}, Deposit: ${service.deposit}, Gift Certificate: $
              {service.giftCert}
              <div onClick={() => removeService(index)}>
                <IoClose />
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
