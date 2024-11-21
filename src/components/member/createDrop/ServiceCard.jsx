import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "../../../styling/serviceCard.module.css";

export default function ServiceCard({ addedService, setAddedService }) {
  const [formValues, setFormValues] = useState({
    description: "",
    cash: "",
    credit: "",
    deposit: "",
    giftCertAmount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: ["cash", "credit", "deposit", "giftCertAmount"].includes(name)
        ? parseFloat(value) || 0
        : value,
    });
  };

  // Adds the service to the local state but does not submit to the server
  const addServiceToLocalList = (e) => {
    e.preventDefault();
    setAddedService([...addedService, formValues]);
    setFormValues({
      description: "",
      cash: "",
      credit: "",
      deposit: "",
      giftCertAmount: "",
    });
  };

  const removeService = (index) => {
    const newAddedServices = addedService.filter((_, i) => i !== index);
    setAddedService(newAddedServices);
  };

  return (
    <article className="pageSetup">
      <h1>Service</h1>
      <section className={styles.serviceForm}>
        <label className={styles.labelName}>Description:</label>
        <input
          className={styles.serviceFormInput}
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          required
        />
        <div className={styles.serviceFormSection}>
          <label className={styles.labelName}>Cash:</label>
          <input
            className={styles.serviceFormInput}
            type="number"
            name="cash"
            step="0.01"
            min="0"
            value={formValues.cash}
            onChange={handleInputChange}
          />
          <label className={styles.labelName}>Credit:</label>
          <input
            className={styles.serviceFormInput}
            type="number"
            name="credit"
            step="0.01"
            min="0"
            value={formValues.credit}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.serviceFormSection}>
          <label className={styles.labelName}>Deposit:</label>
          <input
            className={styles.serviceFormInput}
            type="number"
            name="deposit"
            step="0.01"
            min="0"
            value={formValues.deposit}
            onChange={handleInputChange}
          />
          <label className={styles.labelName}>Gift Certificate:</label>
          <input
            className={styles.serviceFormInput}
            type="number"
            name="giftCertAmount"
            step="0.01"
            min="0"
            value={formValues.giftCertAmount}
            onChange={handleInputChange}
          />
        </div>
        <button
          className={styles.serviceFormInput}
          onClick={addServiceToLocalList}
        >
          Add Service
        </button>
      </section>

      <section>
        <h2>Services to be Added:</h2>
        <div>
          {addedService.map((service, index) => (
            <div key={index}>
              {service.description} - Cash: ${service.cash}, Credit: $
              {service.credit}, Deposit: ${service.deposit}, Gift Certificate: $
              {service.giftCertAmount}
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
