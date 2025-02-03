import React, { useState } from "react";
import styles from "../../../styling/member/createdrop.module.css";

export default function ServiceCard({ addedService, setAddedService }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    description: "",
    cash: "",
    credit: "",
    deposit: "",
    giftCertAmount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addServiceToLocalList = (e) => {
    e.preventDefault();

    const formattedService = {
      ...formValues,
      cash: formValues.cash ? parseFloat(formValues.cash) || 0 : 0,
      credit: formValues.credit ? parseFloat(formValues.credit) || 0 : 0,
      deposit: formValues.deposit ? parseFloat(formValues.deposit) || 0 : 0,
      giftCertAmount: formValues.giftCertAmount
        ? parseFloat(formValues.giftCertAmount) || 0
        : 0,
    };

    setAddedService([...addedService, formattedService]);

    setFormValues({
      description: "",
      cash: "",
      credit: "",
      deposit: "",
      giftCertAmount: "",
    });

    setModalOpen(false);
  };

  const removeService = (index) => {
    setAddedService(addedService.filter((_, i) => i !== index));
  };

  return (
    <article className={styles.servicePage}>
      <button
        className={styles.addServiceButton}
        onClick={() => setModalOpen(true)}
      >
        Add Service
      </button>
      <div
        className={styles.modal}
        style={{ display: modalOpen ? "flex" : "none" }}
      >
        <section className={styles.serviceForm}>
          <div
            className={styles.modalClose}
            onClick={() => setModalOpen(false)}
          >
            X
          </div>
          <div className={styles.serviceFormSection}>
            <label className={styles.labelName}>Description:</label>
            <input
              className={styles.serviceFormInput}
              type="text"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />

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
      </div>
      <section className={styles.addedServices}>
        <h2 className={styles.addedServiceHeader}>Services:</h2>
        <div className={styles.servicesAdded}>
          {addedService.map((service, index) => (
            <div className={styles.serviceAdded} key={index}>
              <div className={styles.addedServiceItemSection}>
                <p className={styles.addedserviceItem}>{service.description}</p>
              </div>

              {service.cash > 0 && (
                <div className={styles.addedServiceItemSection}>
                  <p className={styles.addedserviceItem}>Cash:</p>
                  <p className={styles.addedserviceItem}>${service.cash}</p>
                </div>
              )}

              {service.credit > 0 && (
                <div className={styles.addedServiceItemSection}>
                  <p className={styles.addedserviceItem}>Credit:</p>
                  <p className={styles.addedserviceItem}>${service.credit}</p>
                </div>
              )}

              {service.deposit > 0 && (
                <div className={styles.addedServiceItemSection}>
                  <p className={styles.addedserviceItem}>Deposit:</p>
                  <p className={styles.addedserviceItem}>${service.deposit}</p>
                </div>
              )}

              {service.giftCertAmount > 0 && (
                <div className={styles.addedServiceItemSection}>
                  <p className={styles.addedserviceItem}>Gift Certificate:</p>
                  <p className={styles.addedserviceItem}>
                    ${service.giftCertAmount}
                  </p>
                </div>
              )}

              <button
                className={styles.deleteButton}
                onClick={() => removeService(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
