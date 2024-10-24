import styles from "../../styling/onboardForms.module.css";

export default function OnboardOwner() {
  return (
    <article className="pageSetup">
      <h1 className={styles.header}>Enter your business information</h1>
      <form className={styles.loginForm}>
        <label className={styles.labelName}>Business Name:</label>
        <input className={styles.formInput} type="text" required />
        <label className={styles.labelName}>Business Code:</label>
        <input className={styles.formInput} type="text" required />
        <button className={styles.formSubmit}>Create Business</button>
      </form>
    </article>
  );
}
