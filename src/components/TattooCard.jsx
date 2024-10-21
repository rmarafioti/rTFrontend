import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
//we have a serviceInput and addedService

// serviceInput is an object:

export default function TattooCard({ addedService, setAddedService }) {
  //create a validation errro if no description is entered
  const inputValidationError = {
    description: false,
  };

  // create a variable named serviceInput which is a object of key value pairs the users will input values to via the service form
  const serviceInput = {
    description: "",
    cash: "",
    credit: "",
    deposit: "",
    giftCert: "",
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

  //write a function addService will place user input service into the addedServive array
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

  //write a function removeService user will be able to remove an added service
  const removeService = (index) => {
    const newAddedServices = addedService.filter((_, i) => i !== index);
    setAddedService(newAddedServices);
  };

  return (
    <article className="pageSetup">
      <h1>Service</h1>
      <form className="serviceForm">
        <label className="labelName">
          Description:{" "}
          {validationError.description && (
            <p>*please enter a name for this service</p>
          )}
        </label>
        <input
          className="serviceFormInput"
          type="text"
          name="description"
          aria-label="service description"
          value={formValues.description}
          onChange={handleInputChange}
          required
        />
        <div>
          <label className="labelName">Cash: </label>
          <input
            className="serviceFormInput"
            id="cashInput"
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
          <label className="labelName">Credit: </label>
          <input
            className="serviceFormInput"
            id="creditInput"
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
        <div>
          <label className="labelName">Deposit: </label>
          <input
            className="serviceFormInput"
            id="depositInput"
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
          <label className="labelName">Gift Certificate: </label>
          <input
            className="serviceFormInput"
            id="giftcertInput"
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
          className="serviceFormInput"
          id="addService"
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
