import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessMutation, useGetOwnerQuery } from "../../store/api";
import styles from "../../styling/onboardForms.module.css";

export default function OwnerOnboard() {
  const {
    data: owner,
    isLoading: ownerLoading,
    error: ownerError,
  } = useGetOwnerQuery();
  const [createBusiness, { isLoading }] = useCreateBusinessMutation();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  const businessSubmit = async (e) => {
    e.preventDefault();
    if (!owner || !owner.id) {
      console.error("Owner ID is undefined or owner data failed to load.");
      return;
    }
    try {
      await createBusiness({
        businessName,
        code,
        ownerId: owner.id, // Pass owner ID to associate with the business
      }).unwrap();
      navigate("/ownerdashboard");
    } catch (error) {
      console.error("Failed to create business:", error);
    }
  };

  if (ownerLoading) return <p>Loading owner data...</p>;
  if (ownerError) return <p>Error loading owner data: {ownerError.message}</p>;

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
        <button
          className={styles.formSubmit}
          disabled={isLoading || ownerLoading}
        >
          {isLoading ? "Creating..." : "Create Business"}
        </button>
      </form>
    </article>
  );
}
