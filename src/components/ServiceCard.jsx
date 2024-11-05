import React, { useState } from "react";
import { useMemberCreateServiceMutation } from "../store/api";
import { IoClose } from "react-icons/io5";

import styles from "../styling/serviceCard.module.css";

export default function ServiceCard({ dropId, addedService, setAddedService }) {
  const [createService] = useMemberCreateServiceMutation();
  console.log("Received dropId in ServiceCard:", dropId);

  // create a variable named serviceInput which is a object of key value pairs the users will input values to via the service form
  /*const serviceInput = {
    description: "",
    cash: "",
    credit: "",
    deposit: "",
    giftCert: "",
  };*/

  // setter and a getter to set user values from the input form
  /*const [formValues, setFormValues] = useState(serviceInput);*/

  // setter and a getter to set user values from the input form
  const [formValues, setFormValues] = useState({
    description: "",
    cash: "",
    credit: "",
    deposit: "",
    giftCertAmount: "",
  });

  //create a validation errror if no description is entered
  /*const inputValidationError = {
    description: false,
  };*/

  //setter and getter for validation error
  /*const [validationError, setValidationError] = useState(inputValidationError);*/

  //validate description field
  /*const validateField = (field, value) => {
    let isValid = true;
    if (field === "description") {
      isValid = value.trim() !== "";

      setValidationError({
        ...validationError,
        description: !isValid,
      });
    }
    return isValid;
  };*/

  //function to handle input changes and update formValues
  /*const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]:
        name === "cash" ||
        name === "credit" ||
        name === "deposit" ||
        name === "giftCertAmount"
          ? //change to parseFloat() for decimal values
            parseInt(value) || 0 // Ensure the value is parsed as a number
          : value, // For text fields like description
    });
  };*/

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: ["cash", "credit", "deposit", "giftCertAmount"].includes(name)
        ? parseFloat(value) || 0
        : value,
    });
  };

  //create a function addService to place team member input for a service into the addedServive array
  /*const addService = (e) => {
    e.preventDefault();
    const isDescriptionValid = validateField(
      "description",
      formValues.description
    );
    if (isDescriptionValid) {
      setAddedService([...addedService, formValues]);
      setFormValues(serviceInput);
    }
  };*/

  const addService = async (e) => {
    e.preventDefault();
    try {
      // Pass dropId along with the service details to create the service
      const createdService = await createService({
        dropId,
        description: formValues.description,
        cash: formValues.cash,
        credit: formValues.credit,
        deposit: formValues.deposit,
        giftCertAmount: formValues.giftCertAmount,
      }).unwrap();

      // Update local state
      setAddedService([...addedService, createdService]);
      setFormValues({
        description: "",
        cash: "",
        credit: "",
        deposit: "",
        giftCertAmount: "",
      });
      console.log("Service created successfully:", createdService);
    } catch (error) {
      console.error("Error adding service:", error);
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
      <form className={styles.serviceForm} onSubmit={addService}>
        <label className={styles.labelName}>
          Description:{" "}
          {/*{validationError.description && (
            <p>*please enter a name for this service</p>
          )}*/}
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
            name="giftCertAmount"
            aria-label="giftCertAmount"
            step="0.01"
            min="0"
            placeholder="0.00"
            inputMode="decimal"
            value={formValues.giftCertAmount}
            onChange={handleInputChange}
          />
        </div>
        <button
          className={styles.serviceFormInput}
          id={styles.addService}
          aria-label="form_submit"
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
