import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetMeQuery, useCreateBusinessMutation } from "./ownerSlice";

import styles from "../../styling/onboardForms.module.css";

export default function OwnerOnboard() {
  const { data: me } = useGetMeQuery();
  const [createBusiness, { isLoading }] = useCreateBusinessMutation();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  const businessSubmit = async (e) => {
    e.preventDefault();
    if (!me?.id) {
      console.error("Owner ID is undefined.");
      return;
    }
    try {
      await createBusiness({
        businessName,
        code,
      }).unwrap();
      navigate("/ownerdashboard");
    } catch (error) {
      console.error("failed to create business:", error);
    }
  };
  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Enter your business information</h1>
      <form className={styles.loginForm} onSubmit={businessSubmit}>
        <label className={styles.labelName}>Business Name:</label>
        <input
          className={styles.formInput}
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <label className={styles.labelName}>Business Code:</label>
        <input
          className={styles.formInput}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className={styles.formSubmit} disabled={isLoading}>
          Create Business
        </button>
      </form>
    </article>
  );
}
