import styles from "../../styling/onboardForms.module.css";

export default function OnboardMember() {
  return (
    <article className="pageSetup">
      <h1 className={styles.header}>
        Enter you contact info to connect with other team members
      </h1>
      <form className={styles.loginForm}>
        <label className={styles.labelName}>Phone:</label>
        <input className={styles.formInput} type="text" required />
        <label className={styles.labelName}>Email:</label>
        <input className={styles.formInput} type="email" required />
        <button className={styles.formSubmit}>Submit Contact Info</button>
      </form>
    </article>
  );
}
