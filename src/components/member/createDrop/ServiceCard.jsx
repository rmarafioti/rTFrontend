import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

import styles from "../../../styling/member/createdrop.module.css";

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
    <article className={styles.servicePage}>
      {/*<h1 className={styles.subHeader}>Add Services.</h1>*/}
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
          className={styles.serviceFormButton}
          onClick={addServiceToLocalList}
        >
          Submit Service
        </button>
      </section>

      <section className={styles.addedServices}>
        <h2 className={styles.addedServiceHeader}>Services:</h2>
        <div className={styles.servicesAdded}>
          {addedService.map((service, index) => (
            <div className={styles.serviceAdded} key={index}>
              <div
                className={styles.serviceItemSection}
                id={styles.serviceDescription}
              >
                <p className={styles.serviceItem}>Description:</p>
                <p className={styles.serviceItem}> {service.description}</p>
              </div>
              {service.cash !== "" && (
                <div className={styles.serviceItemSection}>
                  <p className={styles.serviceItem}>Cash:</p>
                  <p className={styles.serviceItem}> ${service.cash}</p>
                </div>
              )}
              {service.credit !== "" && (
                <div className={styles.serviceItemSection}>
                  <p className={styles.serviceItem}>Credit:</p>
                  <p className={styles.serviceItem}> ${service.credit}</p>
                </div>
              )}
              {service.deposit !== "" && (
                <div className={styles.serviceItemSection}>
                  <p className={styles.serviceItem}>Deposit:</p>
                  <p className={styles.serviceItem}> ${service.deposit}</p>
                </div>
              )}
              {service.giftCertAmount !== "" && (
                <div className={styles.serviceItemSection}>
                  <p className={styles.serviceItem}>Gift Certificate:</p>
                  <p className={styles.serviceItem}>
                    {" "}
                    ${service.giftCertAmount}
                  </p>
                </div>
              )}
              <button
                className={styles.deleteButton}
                onClick={() => removeService(index)}
              >
                Delete Service
              </button>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
