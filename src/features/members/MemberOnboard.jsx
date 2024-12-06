import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinkMemberToBusinessMutation } from "./membersSlice";

import styles from "../../styling/onboard.module.css";

export default function MemberOnboard() {
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
      <h1>Submit your business info</h1>
      <form className={styles.onboardForm} onSubmit={handleSubmit}>
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
