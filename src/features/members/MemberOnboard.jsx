import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetMeQuery, useLinkBusinessMutation } from "./membersSlice";

import styles from "../../styling/onboardForms.module.css";

export default function MemberOnboard() {
  const { data: me } = useGetMeQuery();
  const [linkBusiness, { isLoading, error }] = useLinkBusinessMutation();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!me?.id) {
      console.error("Member ID is undefined.");
      return;
    }
    try {
      await linkBusiness({ businessName, code }).unwrap();
      navigate("/memberdashboard"); // Navigate after successful submission
    } catch (err) {
      console.error("Failed to link business:", err);
    }
  };

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Submit your business info</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
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
          Connect to Business
        </button>
      </form>
    </article>
  );
}
