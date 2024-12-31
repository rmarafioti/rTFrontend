import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBusinessQuery } from "../buisness/businessSlice";
import { useLinkMemberToBusinessMutation } from "./membersSlice";

import styles from "../../styling/onboard.module.css";

export default function MemberOnboard() {
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
  } = useGetBusinessQuery();
  const [linkBusiness, { isLoading, isSuccess, isError, error }] =
    useLinkMemberToBusinessMutation();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await linkBusiness({ businessName, code }).unwrap();
      navigate("/memberdashboard"); // Navigate after successful linking
    } catch (err) {
      console.error("Failed to link business:", err);
    }
  };

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Submit your business info</h1>
      <form className={styles.onboardForm} onSubmit={handleSubmit}>
        <label className={styles.labelName}>Select a Business:</label>
        {isBusinessesLoading ? (
          <p>Loading business...</p>
        ) : isBusinessesError ? (
          <p>Error loading businesses</p>
        ) : (
          <select
            className={styles.onboardFormInput}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Select a business --
            </option>
            {businesses.map((business) => (
              <option key={business.id} value={business.name}>
                {business?.businessName}
              </option>
            ))}
          </select>
        )}
        <label className={styles.labelName}>Business Code:</label>
        <input
          className={styles.onboardFormInput}
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className={styles.linkBizButton} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect to Business"}
        </button>
        {isError && (
          <p>
            Error linking to business:{" "}
            {error?.data?.message || "An error occurred"}
          </p>
        )}
      </form>
    </article>
  );
}
