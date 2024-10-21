import React, { useState } from "react";
//we have a serviceInput and addedService

// serviceInput is an object:

export default function TattooCard() {
  //create a validation errro if no description is entered
  const inputValidationError = {
    description: false,
  };

  // create a variable named serviceInput which is a object of key value pairs the users will input values to via the service form
  const serviceInput = {
    description: "",
    cash: 0,
    credit: 0,
    deposit: 0,
    giftCert: 0,
  };

  // setter and getter for addedService starts as an empty array
  const [addedService, setAddedService] = useState([]);
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
      [name]: value,
    });
  };

  //write a function addService with will place user inputted service into the addedServive array
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
            value={formValues.deposit}
            onChange={handleInputChange}
          />
          <label className="labelName">Gift Certificate: </label>
          <input
            className="serviceFormInput"
            id="giftcertInput"
            type="number"
            name="gift certificate"
            aria-label="gift certificate"
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
        <h2>Added Services</h2>
        <ul>
          {addedService.map((service, index) => (
            <li key={index}>
              {service.description} - Cash: ${service.cash}, Credit: $
              {service.credit}, Deposit: ${service.deposit}, Gift Certificate: $
              {service.giftCert}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
