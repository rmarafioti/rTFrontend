import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetOwnerQuery, useCreateBusinessMutation } from "./ownerSlice";

import styles from "../../styling/onboard.module.css";

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
      <h1>Enter your business information</h1>
      <form className={styles.onboardForm} onSubmit={businessSubmit}>
        <label className={styles.labelName}>Business Name:</label>
        <input
          className={styles.onboardFormInput}
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <label className={styles.labelName}>Business Code:</label>
        <input
          className={styles.onboardFormInput}
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          className={styles.createBiz}
          disabled={isLoading || ownerLoading}
        >
          {isLoading ? "Creating..." : "Create Business"}
        </button>
      </form>
    </article>
  );
}
