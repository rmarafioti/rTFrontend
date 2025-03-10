import { Link } from "react-router-dom";
import styles from "../styling/home.module.css";

export default function Home() {
  return (
    <article className="pageSetup">
      <div className={styles.hero}>
        <h1 className={styles.header}>Right Track Bookkeeping.</h1>
        <p className={styles.subHeader}>
          An app for small business owners and independent workers to track
          funds and streamline bookkeeping.
        </p>
      </div>
      <h2 className={styles.loginStatement}>Choose your role:</h2>
      <Link to={`/authowner`}>
        <button className={styles.loginButton}>Owner Login</button>
      </Link>
      {/*<p className={styles.loginStatement}>Are you a team member?</p>*/}
      <Link to={`/authmember`}>
        <button className={styles.loginButton}>Team Member Login</button>
      </Link>
    </article>
  );
}
